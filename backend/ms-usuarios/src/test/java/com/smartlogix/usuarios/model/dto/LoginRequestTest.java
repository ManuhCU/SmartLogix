package com.smartlogix.usuarios.model.dto;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class LoginRequestTest {
    @Test
    void testLoginRequest() {
        LoginRequest req = new LoginRequest();
        req.setUsername("user");
        req.setPassword("pass");

        assertEquals("user", req.getUsername());
        assertEquals("pass", req.getPassword());
    }
}
