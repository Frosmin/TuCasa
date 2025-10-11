package com.tucasa.backend.payload;

import com.tucasa.backend.Constants.Constants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class ResponseSuccess {

    @Autowired
    ApiResponse apiResponse;

    public ResponseEntity<?> responseFindAll( List<?> listObject ){
        Map<String, Object> respuesta = new HashMap<>();
        if( !listObject.isEmpty() ){
            respuesta.put( "message", Constants.RECORDS_FOUND );
            respuesta.put( "status", HttpStatus.OK );
            respuesta.put( "code", HttpStatus.OK.value() );
            respuesta.put( "data", listObject );
        } else{
            respuesta.put( "message", Constants.NO_RECORDS );
            respuesta.put( "status", HttpStatus.NO_CONTENT );
            respuesta.put( "code", HttpStatus.NO_CONTENT.value() );
            respuesta.put( "data", listObject );
        }
        return new ResponseEntity<Map<String, Object>>( respuesta, HttpStatus.OK );
    }

    public ResponseEntity<?> responseFindById( Object object ){
        Map<String, Object> respuesta = new HashMap<>();
        if( object != null ){
            respuesta.put( "message", Constants.RECORDS_FOUND );
            respuesta.put( "status", HttpStatus.OK );
            respuesta.put( "code", HttpStatus.OK.value() );
            respuesta.put( "data", object );
        } else{
            respuesta.put( "message", Constants.NO_RECORDS );
            respuesta.put( "status", HttpStatus.NO_CONTENT );
            respuesta.put( "code", HttpStatus.NO_CONTENT.value() );
            respuesta.put( "data", object );
        }
        return new ResponseEntity<Map<String, Object>>( respuesta, HttpStatus.OK );
    }

    public ResponseEntity<?> responseCreate( Object object ){
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put( "message", Constants.RECORD_CREATED );
        respuesta.put( "status", HttpStatus.CREATED );
        respuesta.put( "code", HttpStatus.CREATED.value() );
        respuesta.put( "data", object );
        return new ResponseEntity<Map<String, Object>>( respuesta, HttpStatus.CREATED );
    }

    public ResponseEntity<?> responseDeleteById( Object object ){
        Map<String, Object> respuesta = new HashMap<>();
        if( object != null ){
            respuesta.put( "message", Constants.RECORD_DELETED );
            respuesta.put( "status", HttpStatus.OK );
            respuesta.put( "code", HttpStatus.OK.value() );
            respuesta.put( "data", object );
        } else{
            respuesta.put( "message", Constants.NO_RECORDS );
            respuesta.put( "status", HttpStatus.NO_CONTENT );
            respuesta.put( "code", HttpStatus.NO_CONTENT.value() );
            respuesta.put( "data", object );
        }
        return new ResponseEntity<Map<String, Object>>( respuesta, HttpStatus.OK );
    }

    public ResponseEntity<?> responseUpdate( Object object ){
        Map<String, Object> respuesta = new HashMap<>();
        if( object != null ){
            respuesta.put( "message", Constants.RECORD_UPDATED );
            respuesta.put( "status", HttpStatus.OK );
            respuesta.put( "code", HttpStatus.OK.value() );
            respuesta.put( "data", object );
        } else{
            respuesta.put( "message", Constants.NO_RECORDS );
            respuesta.put( "status", HttpStatus.NO_CONTENT );
            respuesta.put( "code", HttpStatus.NO_CONTENT.value() );
            respuesta.put( "data", object );
        }
        return new ResponseEntity<Map<String, Object>>( respuesta, HttpStatus.OK );
    }
}
