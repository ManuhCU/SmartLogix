package com.smartlogix.usuarios.model.dto;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class UsuarioDTOTest {
    @Test
    void testUsuarioDTO() {
        UsuarioDTO dto = new UsuarioDTO();
        dto.setUsername("user");
        dto.setRole("USER");
        dto.setCardHolderName("John");
        dto.setCardNumber("1234");
        dto.setCardExpiry("12/25");
        dto.setCardCvv("123");

        assertEquals("user", dto.getUsername());
        assertEquals("USER", dto.getRole());
        assertEquals("John", dto.getCardHolderName());
        assertEquals("1234", dto.getCardNumber());
        assertEquals("12/25", dto.getCardExpiry());
        assertEquals("123", dto.getCardCvv());
    }
}
