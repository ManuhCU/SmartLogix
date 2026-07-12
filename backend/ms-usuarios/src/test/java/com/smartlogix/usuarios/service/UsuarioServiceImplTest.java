package com.smartlogix.usuarios.service;

import com.smartlogix.usuarios.model.dto.LoginRequest;
import com.smartlogix.usuarios.model.dto.UsuarioDTO;
import com.smartlogix.usuarios.model.entity.Usuario;
import com.smartlogix.usuarios.repository.UsuarioRepository;
import com.smartlogix.usuarios.service.impl.UsuarioServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UsuarioServiceImplTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @InjectMocks
    private UsuarioServiceImpl usuarioService;

    private Usuario usuarioMock;

    @BeforeEach
    void setUp() {
        usuarioMock = Usuario.builder()
                .id(1L)
                .username("testuser")
                .password("password123")
                .role("USER")
                .active(true)
                .build();
    }

    @Test
    void debeAutenticarExitosamente() {
        LoginRequest request = new LoginRequest("testuser", "password123");
        when(usuarioRepository.findByUsername("testuser")).thenReturn(Optional.of(usuarioMock));

        UsuarioDTO resultado = usuarioService.autenticar(request);

        assertNotNull(resultado);
        assertEquals("testuser", resultado.getUsername());
        verify(usuarioRepository, times(1)).findByUsername("testuser");
    }

    @Test
    void debeLanzarExcepcionConCredencialesInvalidas() {
        LoginRequest request = new LoginRequest("testuser", "wrongpassword");
        when(usuarioRepository.findByUsername("testuser")).thenReturn(Optional.of(usuarioMock));

        assertThrows(ResponseStatusException.class, () -> usuarioService.autenticar(request));
    }

    @Test
    void debeCrearUsuarioExitosamente() {
        UsuarioDTO requestDto = UsuarioDTO.builder().username("newuser").build();
        when(usuarioRepository.existsByUsername("newuser")).thenReturn(false);
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioMock);

        UsuarioDTO resultado = usuarioService.crearUsuario(requestDto, "password");

        assertNotNull(resultado);
        verify(usuarioRepository, times(1)).save(any(Usuario.class));
    }

    @Test
    void debeLanzarExcepcionSiUsuarioYaExiste() {
        UsuarioDTO requestDto = UsuarioDTO.builder().username("testuser").build();
        when(usuarioRepository.existsByUsername("testuser")).thenReturn(true);

        assertThrows(ResponseStatusException.class, () -> usuarioService.crearUsuario(requestDto, "pass"));
    }

    @Test
    void debeGuardarDatosDeTarjetaAlCrearUsuario() {
        UsuarioDTO requestDto = UsuarioDTO.builder()
                .username("newuser")
                .cardHolderName("Ana Pérez")
                .cardNumber("4111111111111111")
                .cardExpiry("12/30")
                .cardCvv("123")
                .build();

        Usuario usuarioGuardado = Usuario.builder()
                .id(2L)
                .username("newuser")
                .password("password")
                .role("USER")
                .active(true)
                .cardHolderName("Ana Pérez")
                .cardNumber("4111111111111111")
                .cardExpiry("12/30")
                .cardCvv("123")
                .build();

        when(usuarioRepository.existsByUsername("newuser")).thenReturn(false);
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioGuardado);

        UsuarioDTO resultado = usuarioService.crearUsuario(requestDto, "password");

        assertEquals("Ana Pérez", resultado.getCardHolderName());
        assertEquals("4111111111111111", resultado.getCardNumber());
        assertEquals("12/30", resultado.getCardExpiry());
        assertEquals("123", resultado.getCardCvv());
    }

    @Test
    void debeLanzarExcepcionSiUsuarioEstaInactivo() {
        usuarioMock.setActive(false);
        LoginRequest request = new LoginRequest("testuser", "password123");
        when(usuarioRepository.findByUsername("testuser")).thenReturn(Optional.of(usuarioMock));

        assertThrows(ResponseStatusException.class, () -> usuarioService.autenticar(request));
    }
}
