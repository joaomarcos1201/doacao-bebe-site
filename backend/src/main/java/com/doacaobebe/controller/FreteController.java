package com.doacaobebe.controller;

import com.doacaobebe.dto.FreteCalculoRequest;
import com.doacaobebe.entity.Produto;
import com.doacaobebe.repository.ProdutoRepository;
import com.doacaobebe.service.FreteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/shipping")
@CrossOrigin(origins = "*")
public class FreteController {

    @Autowired
    private FreteService freteService;

    @Autowired
    private ProdutoRepository produtoRepository;

    @PostMapping("/calculate")
    public ResponseEntity<?> calcular(@RequestBody FreteCalculoRequest request) {
        try {
            Produto produto = produtoRepository.findById(request.getProdutoId())
                    .orElseThrow(() -> new IllegalArgumentException("Produto não encontrado."));

            BigDecimal valorFrete = freteService.calcularFrete(produto, request.getCepDestino());
            return ResponseEntity.ok(Map.of("valorFrete", valorFrete));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
