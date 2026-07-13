package com.smartlogix.inventario.controller;

import com.smartlogix.inventario.model.dto.ProductoDTO;
import com.smartlogix.inventario.service.ProductoService;
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
import static org.mockito.Mockito.*;

class ProductoControllerTest {

    @Mock
    private ProductoService productoService;

    @InjectMocks
    private ProductoController productoController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testListarTodos() {
        when(productoService.obtenerTodos()).thenReturn(Collections.singletonList(new ProductoDTO()));
        ResponseEntity<List<ProductoDTO>> response = productoController.listarTodos();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void testObtenerPorSku() {
        when(productoService.obtenerPorSku("SKU")).thenReturn(new ProductoDTO());
        ResponseEntity<ProductoDTO> response = productoController.obtenerPorSku("SKU");
        assertEquals(HttpStatus.OK, response.getStatusCode());
    }

    @Test
    void testCrearProducto() {
        when(productoService.crearProducto(any())).thenReturn(new ProductoDTO());
        ResponseEntity<ProductoDTO> response = productoController.crearProducto(new ProductoDTO());
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
    }

    @Test
    void testDescontarStock() {
        doNothing().when(productoService).actualizarStock("SKU", 2);
        ResponseEntity<Void> response = productoController.descontarStock("SKU", 2);
        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
    }
}
