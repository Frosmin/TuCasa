package com.tucasa.backend.security.auth.config;
import com.tucasa.backend.payload.ApiResponse; 
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class GlobalExceptionHandler {

    private final ApiResponse apiResponse;

    public GlobalExceptionHandler(ApiResponse apiResponse) {
        this.apiResponse = apiResponse;
    }

    @ExceptionHandler(EmailAlreadyExistsException.class)
    public ResponseEntity<Object> handleEmailAlreadyExists(EmailAlreadyExistsException ex, WebRequest request) {
        return apiResponse.responseDataError( 
            ex.getMessage(),  
            null       
        );
    }

    @ExceptionHandler(org.springframework.dao.DataIntegrityViolationException.class)
    public ResponseEntity<Object> handleDataIntegrityViolation(org.springframework.dao.DataIntegrityViolationException ex, WebRequest request) {
        String message = "Error de integridad de datos genérico.";
        if (ex.getMessage() != null && ex.getMessage().contains("Key (correo)")) {
            message = "El correo electrónico proporcionado ya se encuentra registrado.";
            return apiResponse.responseDataError(
                message, 
                null
            );
        }
        return apiResponse.responseError(
            message,
            HttpStatus.BAD_REQUEST,
            HttpStatus.BAD_REQUEST.value(),
            null,
            true
        );
    }
}