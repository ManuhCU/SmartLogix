package com.smartlogix.usuarios.controller;

import com.smartlogix.usuarios.model.dto.LoginRequest;
import com.smartlogix.usuarios.model.dto.UsuarioDTO;
import com.smartlogix.usuarios.service.UsuarioService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class UsuarioControllerTest {

    @Mock
    private UsuarioService usuarioService;

    @InjectMocks
    private UsuarioController usuarioController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testListarUsuarios() {
        when(usuarioService.obtenerTodos()).thenReturn(Collections.singletonList(new UsuarioDTO()));
        ResponseEntity<List<UsuarioDTO>> response = usuarioController.listarUsuarios();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void testObtenerUsuario() {
        when(usuarioService.obtenerPorUsername("user")).thenReturn(new UsuarioDTO());
        ResponseEntity<UsuarioDTO> response = usuarioController.obtenerUsuario("user");
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void testCrearUsuario() {
        when(usuarioService.crearUsuario(any(), any())).thenReturn(new UsuarioDTO());
        ResponseEntity<UsuarioDTO> response = usuarioController.crearUsuario(new UsuarioDTO(), "pass");
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
    }

    @Test
    void testAutenticar() {
        when(usuarioService.autenticar(any())).thenReturn(new UsuarioDTO());
        ResponseEntity<UsuarioDTO> response = usuarioController.autenticar(new LoginRequest());
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void testActualizarUsuario() {
        when(usuarioService.actualizarUsuario(any(), any(), any())).thenReturn(new UsuarioDTO());
        ResponseEntity<UsuarioDTO> response = usuarioController.actualizarUsuario("user", new UsuarioDTO(), "pass");
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void testEliminarUsuario() {
        doNothing().when(usuarioService).eliminarPorUsername("user");
        ResponseEntity<Void> response = usuarioController.eliminarUsuario("user");
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }
}
