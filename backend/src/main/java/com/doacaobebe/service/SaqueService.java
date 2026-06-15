package com.doacaobebe.service;

import com.doacaobebe.entity.Saque;
import com.doacaobebe.entity.Usuario;
import com.doacaobebe.repository.SaqueRepository;
import com.doacaobebe.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class SaqueService {

    @Autowired
    private SaqueRepository saqueRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private CarteiraService carteiraService;

    @Transactional
    public Saque solicitarSaque(Integer usuarioId, BigDecimal valor) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado."));

        var carteira = carteiraService.obterCarteira(usuario);
        if (carteira.getSaldoLiberado().compareTo(valor) < 0) {
            throw new IllegalArgumentException("Saldo insuficiente para saque.");
        }

        Saque saque = new Saque();
        saque.setUsuario(usuario);
        saque.setValor(valor);
        return saqueRepository.save(saque);
    }

    @Transactional
    public Saque resolverSaque(Long saqueId, boolean aprovado) {
        Saque saque = saqueRepository.findById(saqueId)
                .orElseThrow(() -> new IllegalArgumentException("Saque não encontrado."));

        saque.setStatus(aprovado ? "APROVADO" : "REJEITADO");
        saque.setDataResolucao(LocalDateTime.now());

        if (aprovado) {
            carteiraService.descontarSaque(saque.getUsuario(), saque.getValor());
        }

        return saqueRepository.save(saque);
    }

    public List<Saque> listarPorUsuario(Integer usuarioId) {
        return saqueRepository.findByUsuarioIdOrderByDataSolicitacaoDesc(usuarioId);
    }

    public List<Saque> listarPendentes() {
        return saqueRepository.findByStatus("PENDENTE");
    }

    public List<Saque> listarTodos() {
        return saqueRepository.findAll();
    }
}
