package com.doacaobebe.config;

import com.doacaobebe.entity.Usuario;
import com.doacaobebe.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("=== BACKEND INICIADO COM SUCESSO ===");
        
        String email = "admin@alemdopositivo.com";
        if (!usuarioRepository.existsByEmail(email)) {
            Usuario admin = new Usuario();
            admin.setNome("Administrador");
            admin.setEmail(email);
            admin.setCpf("00000000000");
            admin.setSenha(passwordEncoder.encode("Admin@123"));
            admin.setNivelAcesso("ADMIN");
            admin.setStatusUsuario("ATIVO");
            usuarioRepository.save(admin);
            System.out.println("Usuário admin criado com senha Admin@123");
        } else {
            System.out.println("Usuário admin já existe.");
        }
    }
}