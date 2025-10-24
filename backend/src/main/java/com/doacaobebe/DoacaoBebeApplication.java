package com.doacaobebe;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class DoacaoBebeApplication {
    public static void main(String[] args) {
        System.out.println("=== INICIANDO BACKEND NA PORTA 7979 ===");
        SpringApplication.run(DoacaoBebeApplication.class, args);
        System.out.println("=== BACKEND INICIADO COM SUCESSO ===");
    }
}