package com.smartlogix.pedidos.controller;

import com.smartlogix.pedidos.model.dto.PedidoDTO;
import com.smartlogix.pedidos.service.PedidoService;
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
import static org.mockito.Mockito.when;

class PedidoControllerTest {

    @Mock
    private PedidoService pedidoService;

    @InjectMocks
    private PedidoController pedidoController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCrearPedido() {
        when(pedidoService.crearPedido(any())).thenReturn(new PedidoDTO());
        ResponseEntity<PedidoDTO> response = pedidoController.crearPedido(new PedidoDTO());
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
    }

    @Test
    void testListarTodos() {
        when(pedidoService.obtenerTodos()).thenReturn(Collections.singletonList(new PedidoDTO()));
        ResponseEntity<List<PedidoDTO>> response = pedidoController.listarTodos();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
    }


}
