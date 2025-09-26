package com.doacaobebe.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarCodigoRecuperacao(String destinatario, String codigo) throws Exception {
        System.out.println("=== ENVIANDO EMAIL ===");
        System.out.println("Para: " + destinatario);
        System.out.println("Código: " + codigo);
        
        try {
            // Simular envio de email para desenvolvimento
            System.out.println("\n" + "=".repeat(50));
            System.out.println("📧 EMAIL SIMULADO - CÓDIGO DE RECUPERAÇÃO");
            System.out.println("Para: " + destinatario);
            System.out.println("Código: " + codigo);
            System.out.println("=".repeat(50) + "\n");
            
            // Comentar o código real de envio até configurar senha do Gmail
            /*
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom("alemdopositivo2024@gmail.com", "Além do Positivo");
            helper.setTo(destinatario);
            helper.setSubject("Código de Recuperação - Além do Positivo");
            
            String htmlContent = String.format(
                "<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>" +
                "<h2 style='color: #ad7378;'>Além do Positivo</h2>" +
                "<p>Seu código de recuperação de senha:</p>" +
                "<div style='background: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px;'>%s</div>" +
                "<p><small>Este código expira em 10 minutos.</small></p>" +
                "</div>", codigo
            );
            
            helper.setText(htmlContent, true);
            mailSender.send(message);
            */
            
            System.out.println("Email simulado enviado com sucesso!");
            
        } catch (Exception e) {
            System.out.println("Erro ao enviar email: " + e.getMessage());
            throw new Exception("Erro ao enviar email: " + e.getMessage());
        }
    }
}