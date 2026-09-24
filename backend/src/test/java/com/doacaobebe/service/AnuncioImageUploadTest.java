package com.doacaobebe.service;

import com.doacaobebe.controller.ProdutoController;
import com.doacaobebe.entity.Usuario;
import com.doacaobebe.entity.Produto;
import com.doacaobebe.repository.*;
import org.junit.jupiter.api.*;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.mock.web.MockMultipartFile;
import java.awt.image.BufferedImage;
import java.math.BigDecimal;
import java.util.Optional;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.junit.jupiter.api.Assertions.*;

class AnuncioImageUploadTest {
    MockMvc mvc;
    ProdutoRepository products;
    byte[] photo;
    @BeforeEach void setup() throws Exception {
        var controller = new ProdutoController();
        products = mock(ProdutoRepository.class);
        var users = mock(UsuarioRepository.class);
        var jwt = mock(JwtService.class);
        ReflectionTestUtils.setField(controller,"produtoRepository",products);
        ReflectionTestUtils.setField(controller,"usuarioRepository",users);
        ReflectionTestUtils.setField(controller,"jwtService",jwt);
        ReflectionTestUtils.setField(controller,"imageOptimizer",new AnuncioImageOptimizer());
        when(jwt.extractEmail("test")).thenReturn("test@example.test");
        when(users.findByEmail("test@example.test")).thenReturn(Optional.of(new Usuario()));
        mvc = MockMvcBuilders.standaloneSetup(controller).build();
        photo = AnuncioImageOptimizerTest.bytes(new BufferedImage(2000,1000,BufferedImage.TYPE_INT_RGB),"jpeg");
    }
    org.springframework.test.web.servlet.request.MockMultipartHttpServletRequestBuilder request() {
        var request = multipart("/api/products");
        request.param("nome","Teste").param("descricao","Teste")
                .param("categoria","Roupas").param("marca","Marca").param("conservacao","Bom")
                .param("preco","10").param("cepOrigem","01001000").header("Authorization","Bearer test");
        return request;
    }
    @Test void allFourPhotosAreOptimizedBeforeSave() throws Exception {
        var request=request();
        for(String field:new String[]{"imagem","imagem_1","imagem_2","imagem_3"})
            request.file(new MockMultipartFile(field,"test.jpg","image/jpeg",photo));
        mvc.perform(request).andExpect(status().isOk());
        var captor=org.mockito.ArgumentCaptor.forClass(Produto.class);
        verify(products).save(captor.capture());
        var p=captor.getValue();
        for(byte[] result:new byte[][]{p.getFoto(),p.getFoto2(),p.getFoto3(),p.getFoto4()}) {
            assertTrue(result.length<photo.length);
            assertEquals(1600,javax.imageio.ImageIO.read(new java.io.ByteArrayInputStream(result)).getWidth());
        }
    }
    @Test void invalidFourthPhotoNeverPartiallySaves() throws Exception {
        mvc.perform(request().file(new MockMultipartFile("imagem",photo))
                .file(new MockMultipartFile("imagem_3","invalid".getBytes()))).andExpect(status().isBadRequest());
        verifyNoInteractions(products);
    }
    @Test void extraDuplicateEmptyAndOversizeFilesAreRejected() throws Exception {
        for(var file:new MockMultipartFile[]{new MockMultipartFile("imagem_4",photo),
                new MockMultipartFile("imagem",new byte[0]),new MockMultipartFile("imagem",new byte[10*1024*1024+1])})
            mvc.perform(request().file(file)).andExpect(status().isBadRequest());
        mvc.perform(request().file(new MockMultipartFile("imagem",photo))
                .file(new MockMultipartFile("imagem",photo))).andExpect(status().isBadRequest());
        verifyNoInteractions(products);
    }
}
