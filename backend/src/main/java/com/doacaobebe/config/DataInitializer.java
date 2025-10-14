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
        // Verificar se já existe um usuário administrador
        if (!usuarioRepository.existsByEmail("admin@alemdopositivo.com")) {
            Usuario admin = new Usuario();
            admin.setNome("Administrador");
            admin.setEmail("admin@alemdopositivo.com");
            admin.setSenha(passwordEncoder.encode("Admin@123"));
            admin.setNivelAcesso("ADMIN");
            admin.setStatusUsuario("ATIVO");
            
            usuarioRepository.save(admin);
            System.out.println("Usuário administrador criado com sucesso!");
            System.out.println("Email: admin@alemdopositivo.com");
            System.out.println("Senha: Admin@123");
        }
    }
}