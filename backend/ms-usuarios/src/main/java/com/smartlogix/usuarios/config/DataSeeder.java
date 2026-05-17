package com.smartlogix.usuarios.config;

import com.smartlogix.usuarios.model.entity.Usuario;
import com.smartlogix.usuarios.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;

    @Override
    public void run(String... args) {
        if (usuarioRepository.count() == 0) {
            usuarioRepository.saveAll(Arrays.asList(
                    Usuario.builder().username("admin").password("admin123").role("ADMIN").active(true).build(),
                    Usuario.builder().username("user1").password("password123").role("USER").active(true).build(),
                    Usuario.builder().username("user2").password("password456").role("USER").active(true).build()
            ));
        }
    }
}
