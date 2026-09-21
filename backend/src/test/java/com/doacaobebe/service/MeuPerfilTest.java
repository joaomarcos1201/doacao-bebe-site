package com.doacaobebe.service;
import com.doacaobebe.controller.AuthController;
import com.doacaobebe.entity.Usuario;
import com.doacaobebe.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;
import java.util.Map;
import java.util.Optional;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
class MeuPerfilTest {
 @Test void jwtIdentityAndPublicResponse() {
  JwtService jwt = mock(JwtService.class);
  UsuarioService service = mock(UsuarioService.class);
  AuthController controller = new AuthController();
  ReflectionTestUtils.setField(controller, "jwtService", jwt);
  ReflectionTestUtils.setField(controller, "usuarioService", service);
  Usuario user = new Usuario("Nome", "owner@example.test", "12345678900", "hash");
  user.setId(1);
  when(jwt.extractEmail("valid")).thenReturn("owner@example.test");
  when(service.atualizarMeuNome("owner@example.test", "Nome")).thenReturn(user);
  var response = controller.atualizarMeuNome("Bearer valid", Map.of("nome", "Nome", "id", "999", "email", "other@example.test"));
  assertEquals(200, response.getStatusCode().value());
  verify(service).atualizarMeuNome("owner@example.test", "Nome");
  Map<?, ?> body = (Map<?, ?>) response.getBody();
  assertEquals(4, body.size());
  assertEquals("Nome", body.get("nome"));
  assertFalse(body.containsKey("senha"));
 }
 @Test void missingInvalidExpiredTokensAreRejected() {
  JwtService jwt = mock(JwtService.class);
  UsuarioService service = mock(UsuarioService.class);
  AuthController controller = new AuthController();
  ReflectionTestUtils.setField(controller, "jwtService", jwt);
  ReflectionTestUtils.setField(controller, "usuarioService", service);
  when(jwt.extractEmail(anyString())).thenThrow(new IllegalArgumentException("Invalid or expired"));
  for (String header : new String[] {null, "", "Basic invalid", "Bearer invalid", "Bearer expired"})
   assertEquals(401, controller.atualizarMeuNome(header, Map.of("nome", "Nome")).getStatusCode().value());
  verifyNoInteractions(service);
 }
 @Test void trimPersistValidateAndPreserveOtherFields() {
  UsuarioRepository repo = mock(UsuarioRepository.class);
  UsuarioService service = new UsuarioService();
  ReflectionTestUtils.setField(service, "usuarioRepository", repo);
  Usuario user = new Usuario("Anterior", "owner@example.test", "12345678900", "hash");
  when(repo.findByEmail("owner@example.test")).thenReturn(Optional.of(user));
  when(repo.save(user)).thenReturn(user);
  assertSame(user, service.atualizarMeuNome("owner@example.test", "  Novo Nome  "));
  assertEquals("Novo Nome", user.getNome());
  assertEquals("owner@example.test", user.getEmail());
  assertEquals("hash", user.getSenha());
  for (String invalid : new String[] {null, "", "   ", "x".repeat(101)})
   assertEquals(400, assertThrows(ResponseStatusException.class, () -> service.atualizarMeuNome("owner@example.test", invalid)).getStatusCode().value());
  user.setStatusUsuario("INATIVO");
  assertEquals(403, assertThrows(ResponseStatusException.class, () -> service.atualizarMeuNome("owner@example.test", "Nome")).getStatusCode().value());
  verify(repo, times(1)).save(any());
 }
}