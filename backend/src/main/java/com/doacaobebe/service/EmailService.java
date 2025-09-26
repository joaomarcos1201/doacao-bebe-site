package com.doacaobebe.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.util.Properties;
import javax.mail.*;
import javax.mail.internet.*;

@Service
public class EmailService {

    @Value("${email.smtp.host:smtp.gmail.com}")
    private String smtpHost;

    @Value("${email.smtp.port:587}")
    private String smtpPort;

    @Value("${email.username:alemdopositivo2024@gmail.com}")
    private String emailUsername;

    @Value("${email.password:senha_app_gmail}")
    private String emailPassword;

    public void enviarCodigoRecuperacao(String destinatario, String codigo) throws Exception {
        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", smtpHost);
        props.put("mail.smtp.port", smtpPort);

        Session session = Session.getInstance(props, new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(emailUsername, emailPassword);
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(emailUsername, "Além do Positivo"));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(destinatario));
            message.setSubject("Código de Recuperação de Senha - Além do Positivo");
            
            String htmlContent = String.format(
                "<html><body style='font-family: Arial, sans-serif;'>" +
                "<div style='max-width: 600px; margin: 0 auto; padding: 20px;'>" +
                "<div style='text-align: center; margin-bottom: 30px;'>" +
                "<h1 style='color: #ad7378;'>🌸 Além do Positivo</h1>" +
                "</div>" +
                "<div style='background-color: #f8f9fa; padding: 30px; border-radius: 10px; border-left: 4px solid #ad7378;'>" +
                "<h2 style='color: #333; margin-bottom: 20px;'>Recuperação de Senha</h2>" +
                "<p style='color: #666; font-size: 16px; line-height: 1.5;'>Olá!</p>" +
                "<p style='color: #666; font-size: 16px; line-height: 1.5;'>Você solicitou a recuperação de senha para sua conta no Além do Positivo.</p>" +
                "<div style='text-align: center; margin: 30px 0;'>" +
                "<div style='background-color: #ad7378; color: white; padding: 15px 30px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 3px; display: inline-block;'>%s</div>" +
                "</div>" +
                "<p style='color: #666; font-size: 14px; line-height: 1.5;'>Este código é válido por 10 minutos.</p>" +
                "<p style='color: #666; font-size: 14px; line-height: 1.5;'>Se você não solicitou esta recuperação, ignore este email.</p>" +
                "</div>" +
                "<div style='text-align: center; margin-top: 30px; color: #999; font-size: 12px;'>" +
                "<p>© 2024 Além do Positivo - Plataforma de Doações</p>" +
                "</div>" +
                "</div></body></html>", 
                codigo
            );
            
            message.setContent(htmlContent, "text/html; charset=utf-8");
            Transport.send(message);
            
        } catch (MessagingException e) {
            throw new Exception("Erro ao enviar email: " + e.getMessage());
        }
    }
}