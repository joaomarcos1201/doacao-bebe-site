package com.doacaobebe.controller;

import com.doacaobebe.entity.Anuncio;
import com.doacaobebe.repository.AnuncioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/anuncios")
@CrossOrigin(origins = "http://localhost:3000")
public class AnuncioController {

    @Autowired
    private AnuncioRepository anuncioRepository;

    @PostMapping
    public ResponseEntity<String> cadastrarAnuncio(
            @RequestParam("nome") String nome,
            @RequestParam("categoria") String categoria,
            @RequestParam("descricao") String descricao,
            @RequestParam("estado") String estado,
            @RequestParam("contato") String contato,
            @RequestParam("cpf") String cpf,
            @RequestParam("doador") String doador,
            @RequestParam(value = "foto", required = false) MultipartFile foto) {
        try {

            String fotoUrl = null;
            if (foto != null && !foto.isEmpty()) {
                fotoUrl = "https://via.placeholder.com/400x300?text=" + nome.replace(" ", "+");
            }

            Anuncio anuncio = new Anuncio(
                nome,
                categoria,
                descricao,
                estado,
                contato,
                cpf,
                fotoUrl,
                doador != null ? doador : "Doador Anônimo"
            );
            
            anuncioRepository.save(anuncio);
            return ResponseEntity.ok("Anúncio cadastrado com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao cadastrar anúncio: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Anuncio>> listarAnuncios() {
        List<Anuncio> anuncios = anuncioRepository.findAll();
        return ResponseEntity.ok(anuncios);
    }

    @GetMapping("/aprovados")
    public ResponseEntity<List<Anuncio>> listarAnunciosAprovados() {
        List<Anuncio> anuncios = anuncioRepository.findByStatusOrderByDataCriacaoDesc("aprovado");
        return ResponseEntity.ok(anuncios);
    }

    @GetMapping("/pendentes")
    public ResponseEntity<List<Anuncio>> listarAnunciosPendentes() {
        List<Anuncio> anuncios = anuncioRepository.findByStatusOrderByDataCriacaoDesc("pendente");
        return ResponseEntity.ok(anuncios);
    }

    @PutMapping("/{id}/aprovar")
    public ResponseEntity<String> aprovarAnuncio(@PathVariable Long id) {
        try {
            Anuncio anuncio = anuncioRepository.findById(id).orElse(null);
            if (anuncio != null) {
                anuncio.setStatus("aprovado");
                anuncioRepository.save(anuncio);
                return ResponseEntity.ok("Anúncio aprovado com sucesso!");
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao aprovar anúncio: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> removerAnuncio(@PathVariable Long id) {
        try {
            anuncioRepository.deleteById(id);
            return ResponseEntity.ok("Anúncio removido com sucesso!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao remover anúncio: " + e.getMessage());
        }
    }

    @GetMapping("/{id}/foto")
    public ResponseEntity<String> obterFoto(@PathVariable Long id) {
        try {
            Anuncio anuncio = anuncioRepository.findById(id).orElse(null);
            if (anuncio != null && anuncio.getFoto() != null) {
                return ResponseEntity.ok(anuncio.getFoto());
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}