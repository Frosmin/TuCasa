package com.tucasa.backend.security.auth.service;


import com.tucasa.backend.model.dto.UsuarioResponseDto;
import com.tucasa.backend.model.entity.Usuario;
import com.tucasa.backend.model.enums.TipoUsuario;
import com.tucasa.backend.model.repository.UsuarioRepository;
import com.tucasa.backend.security.auth.config.EmailAlreadyExistsException;
import com.tucasa.backend.security.auth.dto.AuthenticationRequest;
import com.tucasa.backend.security.auth.dto.RegisterRequest;
import com.tucasa.backend.security.auth.jwt.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthenticationService {

    private final UsuarioRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authManager;

    public AuthenticationService(UsuarioRepository userRepository,
                                 PasswordEncoder passwordEncoder,
                                 JwtService jwtService,
                                 AuthenticationManager authManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authManager = authManager;
    }

    @Transactional 
    public Map<String, Object> register(RegisterRequest request) {
        if (userRepository.findByCorreo(request.email()).isPresent()) {
            throw new EmailAlreadyExistsException(request.email());
        }
        
        Usuario user = new Usuario();
        user.setNombre(request.name());
        user.setApellido(request.apellido());
        user.setCorreo(request.email());
        user.setContrasenia(passwordEncoder.encode(request.password()));
        user.setDireccion(request.direccion());
        user.setTelefono(request.telefono());
        user.setRol(TipoUsuario.CLIENTE);

        Usuario savedUser = userRepository.save(user);
        String token = jwtService.generateToken(savedUser.getCorreo());

        UsuarioResponseDto dto = new UsuarioResponseDto();
        dto.setId(user.getId());
        dto.setNombre(user.getNombre());
        dto.setApellido(user.getApellido());
        dto.setTelefono(user.getTelefono());
        dto.setDireccion(user.getDireccion());
        dto.setCorreo(user.getCorreo());
        dto.setRol(user.getRol());
        
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("usuario", dto);
        responseData.put("token", token);
        
        return responseData;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> authenticate(AuthenticationRequest request) {
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        Usuario user = userRepository.findByCorreo(request.email())
                .orElseThrow();
        String token = jwtService.generateToken(user.getCorreo());

        UsuarioResponseDto dto = new UsuarioResponseDto();
        dto.setId(user.getId());
        dto.setNombre(user.getNombre());
        dto.setApellido(user.getApellido());
        dto.setTelefono(user.getTelefono());
        dto.setDireccion(user.getDireccion());
        dto.setCorreo(user.getCorreo());
        dto.setRol(user.getRol());

        Map<String, Object> responseData = new HashMap<>();
        responseData.put("usuario", dto);
        responseData.put("token", token);
        return responseData;
    }
}