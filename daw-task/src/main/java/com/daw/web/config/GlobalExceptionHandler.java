package com.daw.web.config;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.daw.services.exceptions.TareaException;
import com.daw.services.exceptions.TareaNotFoundException;
import com.daw.services.exceptions.TareaSecurityException;

@RestControllerAdvice
public class GlobalExceptionHandler {
	
	@ExceptionHandler(TareaNotFoundException.class)
    public ResponseEntity<String> handleNotFound(TareaNotFoundException ex) {
		return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }
	
	@ExceptionHandler(TareaException.class)
    public ResponseEntity<String> handleNotFound(TareaException ex) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }
	
	@ExceptionHandler(TareaSecurityException.class)
    public ResponseEntity<String> handleNotFound(TareaSecurityException ex) {
		return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
    }
	
}
