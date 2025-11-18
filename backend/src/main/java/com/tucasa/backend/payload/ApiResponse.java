package com.tucasa.backend.payload;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Component
public class ApiResponse {

    public ResponseEntity<Object> responseSuccess( String message, Object object ){
        Map<String, Object> response = new HashMap<>();
        response.put( "error", false );
        response.put( "message", message );
        response.put( "status", HttpStatus.OK );
        response.put( "code", HttpStatus.OK.value() );
        response.put( "data", object );
        return new ResponseEntity<Object>( response, HttpStatus.OK );
    }

    public ResponseEntity<Object> responseSearch(String message, Object object, Integer totalResults, BigDecimal avgPrice ){
        Map<String, Object> response = new HashMap<>();
        response.put( "error", false );
        response.put( "message", message );
        response.put( "status", HttpStatus.OK );
        response.put( "code", HttpStatus.OK.value() );
        response.put("totalResults", totalResults);
        response.put("average", avgPrice);
        response.put( "data", object );
        return new ResponseEntity<Object>( response, HttpStatus.OK );
    }

    public ResponseEntity<Object> responseCreate( String message, Object object ){
        Map<String, Object> response = new HashMap<>();
        response.put( "error", false );
        response.put( "message", message );
        response.put( "status", HttpStatus.CREATED );
        response.put( "code", HttpStatus.CREATED.value() );
        response.put( "data", object );
        return new ResponseEntity<>( response, HttpStatus.CREATED );
    }

    public ResponseEntity<Object> responseError( String message, HttpStatus status, int code, Object object, boolean error ){
        Map<String, Object> response = new HashMap<>();
        response.put( "error", error );
        response.put( "message", message );
        response.put( "status", status );
        response.put( "code", code );
        response.put( "data", object );
        return new ResponseEntity<>( response, status );
    }
    
    public ResponseEntity<Object> responseDeleteError( String message, Object object ){
        Map<String, Object> response = new HashMap<>();
        response.put( "error", true );
        response.put( "message", message );
        response.put( "status", HttpStatus.OK );
        response.put( "code", HttpStatus.OK.value() );
        response.put( "data", object );
        return new ResponseEntity<>( response, HttpStatus.OK );
    }

	public ResponseEntity<?> responseCreateError(String message) {
		Map<String, Object> response = new HashMap<>();
        response.put( "error", true );
        response.put( "message", message );
        response.put( "status", HttpStatus.CONFLICT );
        response.put( "code", HttpStatus.CONFLICT.value());
        response.put( "data", "Error" );
        return new ResponseEntity<>( response, HttpStatus.CONFLICT);
		
	}

    public ResponseEntity<Object> responseDataError( String message, Object object ){
        Map<String, Object> response = new HashMap<>();
        response.put( "error", true );
        response.put( "message", message );
        response.put( "status", HttpStatus.CONFLICT );
        response.put( "code", HttpStatus.CONFLICT.value() );
        response.put( "data", object );
        return new ResponseEntity<>( response, HttpStatus.CONFLICT );
    }

    /*Metodo actualizado para resouesta de tokens de jwt*/
    public ResponseEntity<Object> responseCreateWithToken(String message, Object object, String token) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", false);
        response.put("message", message);
        response.put("status", HttpStatus.CREATED);
        response.put("code", HttpStatus.CREATED.value());
        response.put("data", object);
        response.put("token", token);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    public ResponseEntity<Object> responseNotFoundError( String message, Object object ){
        Map<String, Object> response = new HashMap<>();
        response.put( "error", true );
        response.put( "message", message );
        response.put( "status", HttpStatus.NOT_FOUND );
        response.put( "code", HttpStatus.NOT_FOUND.value() );
        response.put( "data", object );
        return new ResponseEntity<>( response, HttpStatus.NOT_FOUND );
    }

    public ResponseEntity<Object> responseBadRequest(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", true);
        response.put("message", message);
        response.put("status", HttpStatus.BAD_REQUEST);
        response.put("code", HttpStatus.BAD_REQUEST.value());
        response.put("data", null);
        return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
    }
}
