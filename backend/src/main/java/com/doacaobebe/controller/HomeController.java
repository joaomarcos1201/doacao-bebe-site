package com.doacaobebe.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestController
public class HomeController {

    @GetMapping("/")
    public ResponseEntity<String> home() {
        String html = """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Doação Bebê - Backend</title>
                <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f0f4f8; }
                    .card { background: white; padding: 40px; border-radius: 12px; display: inline-block; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    h1 { color: #2d6a4f; }
                    p { color: #555; }
                    a { display: inline-block; margin-top: 20px; padding: 12px 30px; background: #2d6a4f; color: white; border-radius: 8px; text-decoration: none; font-size: 16px; }
                    a:hover { background: #1b4332; }
                    .status { color: #40916c; font-weight: bold; }
                </style>
            </head>
            <body>
                <div class="card">
                    <h1>🍼 Doação Bebê</h1>
                    <p class="status">✅ Backend rodando na porta 7979</p>
                    <p>A interface do sistema está disponível no frontend.</p>
                    <a href="http://localhost:3000">Acessar o Sistema</a>
                </div>
            </body>
            </html>
            """;
        return ResponseEntity.ok().header("Content-Type", "text/html; charset=UTF-8").body(html);
    }
}
