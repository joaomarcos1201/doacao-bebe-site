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
        System.out.println("Para criar o usuário admin, execute no SQL Server:");
        System.out.println("INSERT INTO Usuario (nome, email, cpf, dataNascimento, senha, nivelAcesso, dataCadastro, statusUsuario)");
        System.out.println("VALUES ('Administrador', 'admin@alemdopositivo.com', '00000000000', NULL, '" + passwordEncoder.encode("Admin@123") + "', 'ADMIN', GETDATE(), 'ATIVO')");
    }
}