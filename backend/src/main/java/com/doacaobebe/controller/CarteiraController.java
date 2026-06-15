package com.doacaobebe.controller;

import com.doacaobebe.entity.Carteira;
import com.doacaobebe.entity.MovimentacaoFinanceira;
import com.doacaobebe.entity.Usuario;
import com.doacaobebe.repository.UsuarioRepository;
import com.doacaobebe.service.CarteiraService;
import com.doacaobebe.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wallet")
@CrossOrigin(origins = "*")
public class CarteiraController {

    @Autowired
    private CarteiraService carteiraService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @GetMapping
    public ResponseEntity<Carteira> minhacarteira(@RequestHeader("Authorization") String authHeader) {
        Usuario usuario = extrairUsuario(authHeader);
        return ResponseEntity.ok(carteiraService.obterCarteira(usuario));
    }

    @GetMapping("/history")
    public ResponseEntity<List<MovimentacaoFinanceira>> historico(@RequestHeader("Authorization") String authHeader) {
        Usuario usuario = extrairUsuario(authHeader);
        return ResponseEntity.ok(carteiraService.obterHistorico(usuario.getId()));
    }

    private Usuario extrairUsuario(String authHeader) {
        String email = jwtService.extractEmail(authHeader.replace("Bearer ", ""));
        return usuarioRepository.findByEmail(email).orElseThrow();
    }
}
