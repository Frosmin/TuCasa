// package com.tucasa.backend.security.auth.config;

// import org.springframework.boot.CommandLineRunner;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.crypto.password.PasswordEncoder;

// import com.tucasa.backend.model.entity.Usuario;
// import com.tucasa.backend.model.enums.TipoUsuario;
// import com.tucasa.backend.model.repository.UsuarioRepository;

// @Configuration
// public class DataInitializer {

//     @Bean
//     CommandLineRunner initAdmin(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
//         return args -> {
//             try {
//                 if (usuarioRepository.findByCorreo("admin@tucasa.com").isEmpty()) {
//                     Usuario admin = new Usuario();
//                     admin.setNombre("Admin");
//                     admin.setApellido("Principal");
//                     admin.setCorreo("admin@tucasa.com");
//                     admin.setContrasenia(passwordEncoder.encode("admin123"));
//                     admin.setRol(TipoUsuario.ADMIN);
//                     usuarioRepository.save(admin);
//                     System.out.println("✅ Usuario ADMIN creado: admin@tucasa.com / admin123");
//                 }
//             } catch (Exception e) {
//                 System.err.println("❌ Error creando usuario admin: " + e.getMessage());
//             }
//         };
//     }
// }
