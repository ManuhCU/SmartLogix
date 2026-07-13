package com.smartlogix.pedidos.model.entity;

import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;
import static org.junit.jupiter.api.Assertions.*;

class PedidoTest {
    @Test
    void testPedido() {
        Pedido p = new Pedido();
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
