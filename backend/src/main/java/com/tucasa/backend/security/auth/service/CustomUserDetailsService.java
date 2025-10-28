package com.tucasa.backend.security.auth.service;

import com.tucasa.backend.model.entity.Usuario;
import com.tucasa.backend.model.repository.UsuarioRepository;

import java.util.List;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioRepository userRepository;

    public CustomUserDetailsService(UsuarioRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario user = userRepository.findByCorreo(email)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
        List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_" + user.getRol().name()));
        return new org.springframework.security.core.userdetails.User(
                user.getCorreo(),
                user.getContrasenia(),
                authorities
        );
    }
}
