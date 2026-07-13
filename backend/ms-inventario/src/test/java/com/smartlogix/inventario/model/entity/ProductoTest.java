package com.smartlogix.inventario.model.entity;

import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;

class ProductoTest {
    @Test
    void testProducto() {
        Producto p = new Producto();
        p.setId(1L);
        p.setSku("SKU-1");
        p.setNombre("Prod");
        p.setDescripcion("Desc");
        p.setPrecio(BigDecimal.TEN);
        p.setStockActual(10);

        assertEquals(1L, p.getId());
        assertEquals("SKU-1", p.getSku());
        assertEquals("Prod", p.getNombre());
        assertEquals("Desc", p.getDescripcion());
        assertEquals(BigDecimal.TEN, p.getPrecio());
        assertEquals(10, p.getStockActual());
    }
}
