package com.smartlogix.bff.controller;

import com.smartlogix.bff.model.PedidoDTO;
import com.smartlogix.bff.model.ProductoDTO;
import com.smartlogix.bff.model.LoginRequest;
import com.smartlogix.bff.model.LoginResponse;
import com.smartlogix.bff.model.User;
import com.smartlogix.bff.service.BffService;
import com.smartlogix.bff.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class BffController {

    private final BffService bffService;
    private final AuthService authService;

    @GetMapping("/store/catalogo")
    public ResponseEntity<List<ProductoDTO>> obtenerCatalogo() {
        return ResponseEntity.ok(bffService.obtenerCatalogo());
    }

    @PostMapping("/store/comprar")
    public ResponseEntity<PedidoDTO> realizarCompra(@RequestBody PedidoDTO pedidoDTO) {
        PedidoDTO response = bffService.realizarCompra(pedidoDTO);
        return ResponseEntity.ok(response);
    }

    // Endpoints de autenticación
    @PostMapping("/auth/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        User user = authService.authenticate(loginRequest.getUsername(), loginRequest.getPassword());
        
        if (user != null) {
            return ResponseEntity.ok(new LoginResponse(true, "Login exitoso", user.getUsername(), user.getRole()));
        } else {
            return ResponseEntity.status(401).body(new LoginResponse(false, "Usuario o contraseña inválidos"));
        }
    }

    @GetMapping("/auth/verify")
    public ResponseEntity<LoginResponse> verify(@RequestParam String username) {
        User user = authService.getUserByUsername(username);
        
        if (user != null) {
            return ResponseEntity.ok(new LoginResponse(true, "Usuario válido", user.getUsername(), user.getRole()));
        } else {
            return ResponseEntity.status(404).body(new LoginResponse(false, "Usuario no encontrado"));
        }
    }
}
