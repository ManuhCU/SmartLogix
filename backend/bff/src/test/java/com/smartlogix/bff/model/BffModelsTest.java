package com.smartlogix.bff.model;

import org.junit.jupiter.api.Test;
import java.math.BigDecimal;
import static org.junit.jupiter.api.Assertions.*;

class BffModelsTest {

    @Test
    void testLoginRequest() {
        LoginRequest req = new LoginRequest("user", "pass");
        req.setUsername("user2");
        req.setPassword("pass2");
        assertEquals("user2", req.getUsername());
        assertEquals("pass2", req.getPassword());
        
        LoginRequest req2 = new LoginRequest();
        req2.setUsername("u");
        assertEquals("u", req2.getUsername());
    }

    @Test
    void testLoginResponse() {
        LoginResponse res = new LoginResponse(true, "msg", "user", "role", "cardHolder", "cardNumber", "expiry", "cvv");
        res.setSuccess(false);
        res.setMessage("msg2");
        res.setUsername("user2");
        res.setRole("role2");
        res.setCardHolderName("holder");
        res.setCardNumber("123");
        res.setCardExpiry("12/12");
        res.setCardCvv("123");
        
        assertFalse(res.isSuccess());
        assertEquals("msg2", res.getMessage());
        assertEquals("user2", res.getUsername());
        assertEquals("role2", res.getRole());
        assertEquals("holder", res.getCardHolderName());
        assertEquals("123", res.getCardNumber());
        assertEquals("12/12", res.getCardExpiry());
        assertEquals("123", res.getCardCvv());

        LoginResponse res2 = new LoginResponse(true, "msg", "user", "role");
        assertTrue(res2.isSuccess());
    }

    @Test
    void testPedidoDTO() {
        PedidoDTO p = new PedidoDTO();
        p.setId(1L);
        p.setSkuProducto("SKU");
        p.setCantidad(2);
        p.setEstado("PENDIENTE");
        p.setUsername("user");
        p.setNombreProducto("Nombre");
        
        assertEquals(1L, p.getId());
        assertEquals("SKU", p.getSkuProducto());
        assertEquals(2, p.getCantidad());
        assertEquals("PENDIENTE", p.getEstado());
        assertEquals("user", p.getUsername());
        assertEquals("Nombre", p.getNombreProducto());
    }

    @Test
    void testProductoDTO() {
        ProductoDTO p = new ProductoDTO();
        p.setSku("SKU");
        p.setNombre("N");
        p.setDescripcion("D");
        p.setPrecio(BigDecimal.ONE);
        p.setStockActual(10);
        
        assertEquals("SKU", p.getSku());
        assertEquals("N", p.getNombre());
        assertEquals("D", p.getDescripcion());
        assertEquals(BigDecimal.ONE, p.getPrecio());
        assertEquals(10, p.getStockActual());
    }

    @Test
    void testUser() {
        User u = new User();
        u.setUsername("u");
        u.setPassword("p");
        u.setRole("r");
        
        assertEquals("u", u.getUsername());
        assertEquals("p", u.getPassword());
        assertEquals("r", u.getRole());
    }

    @Test
    void testUsuarioDTO() {
        UsuarioDTO u = new UsuarioDTO();
        u.setUsername("u");
        u.setRole("r");
        u.setCardHolderName("name");
        
        assertEquals("u", u.getUsername());
        assertEquals("r", u.getRole());
        assertEquals("name", u.getCardHolderName());
    }
}
