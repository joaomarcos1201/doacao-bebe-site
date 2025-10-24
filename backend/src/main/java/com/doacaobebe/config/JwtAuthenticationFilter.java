package com.doacaobebe.config;

import com.doacaobebe.entity.Usuario;
import com.doacaobebe.repository.UsuarioRepository;
import com.doacaobebe.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Optional;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String authHeader = request.getHeader("Authorization");
        
        // Pular verificação para endpoints públicos
        String requestPath = request.getRequestURI();
        if (requestPath.contains("/auth/") || requestPath.contains("/api/contato") || 
            requestPath.contains("/api/produtos") && "GET".equals(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                String email = jwtService.extractEmail(token);
                Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
                
                if (usuarioOpt.isPresent()) {
                    Usuario usuario = usuarioOpt.get();
                    
                    // Verificar se o usuário está inativo
                    if ("INATIVO".equals(usuario.getStatusUsuario())) {
                        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                        response.setContentType("application/json");
                        response.getWriter().write("{\"error\":\"Conta inativa. Entre em contato com o administrador.\"}");
                        return;
                    }
                }
            } catch (Exception e) {
                // Token inválido, deixar passar para outros filtros tratarem
            }
        }
        
        filterChain.doFilter(request, response);
    }
}