package com.smartlogix.bff.controller;

import com.smartlogix.bff.model.*;
import com.smartlogix.bff.service.BffService;
import com.smartlogix.bff.service.AuthService;
import com.smartlogix.bff.client.UsuariosClient;
import com.smartlogix.bff.client.InventarioClient;
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

class BffControllerTest {

    @Mock
    private BffService bffService;

    @Mock
    private AuthService authService;

    @Mock
    private UsuariosClient usuariosClient;

    @Mock
    private InventarioClient inventarioClient;

    @InjectMocks
    private BffController bffController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testObtenerCatalogo() {
        when(bffService.obtenerCatalogo()).thenReturn(Collections.singletonList(new ProductoDTO()));
        ResponseEntity<List<ProductoDTO>> response = bffController.obtenerCatalogo();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void testRealizarCompra() {
        when(bffService.realizarCompra(any())).thenReturn(new PedidoDTO());
        ResponseEntity<PedidoDTO> response = bffController.realizarCompra(new PedidoDTO());
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void testObtenerPedidos() {
        when(bffService.obtenerPedidos()).thenReturn(Collections.singletonList(new PedidoDTO()));
        ResponseEntity<List<PedidoDTO>> response = bffController.obtenerPedidos();
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void testLoginSuccess() {
        User u = new User();
        u.setUsername("u");
        u.setRole("r");
        when(authService.authenticate(any(), any())).thenReturn(u);
        ResponseEntity<LoginResponse> response = bffController.login(new LoginRequest());
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(true, response.getBody().isSuccess());
    }

    @Test
    void testLoginFail() {
        when(authService.authenticate(any(), any())).thenThrow(new RuntimeException("Error"));
        ResponseEntity<LoginResponse> response = bffController.login(new LoginRequest());
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
        assertEquals(false, response.getBody().isSuccess());
    }

    @Test
    void testVerifySuccess() {
        User u = new User();
        u.setUsername("u");
        u.setRole("r");
        when(authService.getUserByUsername("u")).thenReturn(u);
        ResponseEntity<LoginResponse> response = bffController.verify("u");
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(true, response.getBody().isSuccess());
    }

    @Test
    void testVerifyFail() {
        when(authService.getUserByUsername("u")).thenThrow(new RuntimeException("Error"));
        ResponseEntity<LoginResponse> response = bffController.verify("u");
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals(false, response.getBody().isSuccess());
    }

    @Test
    void testListarUsuarios() {
        when(authService.getAllUsers()).thenReturn(Collections.singletonList(new UsuarioDTO()));
        ResponseEntity<List<UsuarioDTO>> response = bffController.listarUsuarios();
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void testCrearUsuario() {
        when(usuariosClient.crearUsuario(any(), any())).thenReturn(new UsuarioDTO());
        ResponseEntity<UsuarioDTO> response = bffController.crearUsuario(new UsuarioDTO(), "pass");
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
    }

    @Test
    void testActualizarUsuario() {
        when(usuariosClient.actualizarUsuario(any(), any(), any())).thenReturn(new UsuarioDTO());
        ResponseEntity<UsuarioDTO> response = bffController.actualizarUsuario("user", new UsuarioDTO(), "pass");
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void testEliminarUsuario() {
        doNothing().when(usuariosClient).eliminarUsuario("user");
        ResponseEntity<Void> response = bffController.eliminarUsuario("user");
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }

    @Test
    void testCrearProducto() {
        when(inventarioClient.crearProducto(any())).thenReturn(new ProductoDTO());
        ResponseEntity<ProductoDTO> response = bffController.crearProducto(new ProductoDTO());
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
    }

    @Test
    void testActualizarProducto() {
        when(inventarioClient.actualizarProducto(any(), any())).thenReturn(new ProductoDTO());
        ResponseEntity<ProductoDTO> response = bffController.actualizarProducto("SKU", new ProductoDTO());
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void testDescontarStock() {
        doNothing().when(inventarioClient).descontarStock("SKU", 2);
        ResponseEntity<Void> response = bffController.descontarStock("SKU", 2);
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }
}
