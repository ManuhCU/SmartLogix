package com.smartlogix.inventario.model.dto;

import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;

class ProductoDTOTest {
    @Test
    void testProductoDTO() {
        ProductoDTO p = new ProductoDTO();
        p.setSku("SKU-1");
        p.setNombre("Prod");
        p.setDescripcion("Desc");
        p.setPrecio(BigDecimal.TEN);
        p.setStockActual(10);

        assertEquals("SKU-1", p.getSku());
        assertEquals("Prod", p.getNombre());
        assertEquals("Desc", p.getDescripcion());
        assertEquals(BigDecimal.TEN, p.getPrecio());
        assertEquals(10, p.getStockActual());
    }
}
