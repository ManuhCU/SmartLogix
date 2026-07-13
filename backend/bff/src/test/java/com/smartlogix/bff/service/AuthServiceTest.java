package com.smartlogix.bff.service;

import com.smartlogix.bff.model.LoginRequest;
import com.smartlogix.bff.model.User;
import com.smartlogix.bff.model.UsuarioDTO;
import com.smartlogix.bff.client.UsuariosClient;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class AuthServiceTest {

    @Mock
    private UsuariosClient usuariosClient;

    @InjectMocks
    private AuthService authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAuthenticate() {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setUsername("user");
        dto.setRole("USER");
        when(usuariosClient.autenticar(any())).thenReturn(dto);

        User u = authService.authenticate("user", "pass");
        assertNotNull(u);
        assertEquals("user", u.getUsername());
    }

    @Test
    void testGetUserByUsername() {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setUsername("user");
        dto.setRole("USER");
        when(usuariosClient.obtenerPorUsername("user")).thenReturn(dto);

        User u = authService.getUserByUsername("user");
        assertNotNull(u);
        assertEquals("user", u.getUsername());
    }

    @Test
    void testGetAllUsers() {
        when(usuariosClient.listarTodos()).thenReturn(Collections.singletonList(new UsuarioDTO()));
        List<UsuarioDTO> users = authService.getAllUsers();
        assertEquals(1, users.size());
    }
}
