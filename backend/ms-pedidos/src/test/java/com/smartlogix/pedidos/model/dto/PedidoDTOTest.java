package com.smartlogix.pedidos.model.dto;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.*;

class PedidoDTOTest {
    @Test
    void testPedidoDTO() {
        PedidoDTO p = new PedidoDTO();
        p.setId(1L);
        p.setSkuProducto("SKU-1");
        p.setCantidad(2);
        p.setEstado("PENDIENTE");
        p.setUsername("user");
        p.setNombreProducto("Producto A");

        assertEquals(1L, p.getId());
        assertEquals("SKU-1", p.getSkuProducto());
        assertEquals(2, p.getCantidad());
        assertEquals("PENDIENTE", p.getEstado());
        assertEquals("user", p.getUsername());
        assertEquals("Producto A", p.getNombreProducto());
    }
}
