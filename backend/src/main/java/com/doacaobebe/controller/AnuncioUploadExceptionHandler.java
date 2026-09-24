package com.doacaobebe.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

@RestControllerAdvice(assignableTypes = ProdutoController.class)
public class AnuncioUploadExceptionHandler {
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<String> uploadTooLarge(MaxUploadSizeExceededException exception) {
        return ResponseEntity.status(413).body("Upload excedido: máximo de 10 MiB por foto, quatro fotos e 41 MiB por requisição.");
    }
}
