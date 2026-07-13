package com.smartlogix.usuarios.model.entity;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class UsuarioTest {

    @Test
    void testUsuarioEntity() {
        Usuario usuario = new Usuario();
        usuario.setId(1L);
        usuario.setUsername("admin");
        usuario.setPassword("pass");
        usuario.setRole("ADMIN");
        usuario.setCardHolderName("John Doe");
        usuario.setCardNumber("1234567890123456");
        usuario.setCardExpiry("12/25");
        usuario.setCardCvv("123");

        assertEquals(1L, usuario.getId());
        assertEquals("admin", usuario.getUsername());
        assertEquals("pass", usuario.getPassword());
        assertEquals("ADMIN", usuario.getRole());
        assertEquals("John Doe", usuario.getCardHolderName());
        assertEquals("1234567890123456", usuario.getCardNumber());
        assertEquals("12/25", usuario.getCardExpiry());
        assertEquals("123", usuario.getCardCvv());
    }
}
