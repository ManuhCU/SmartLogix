package com.smartlogix.bff.controller;

import com.smartlogix.bff.model.PedidoDTO;
import com.smartlogix.bff.model.ProductoDTO;
import com.smartlogix.bff.model.LoginRequest;
import com.smartlogix.bff.model.LoginResponse;
import com.smartlogix.bff.model.User;
import com.smartlogix.bff.model.UsuarioDTO;
import com.smartlogix.bff.service.BffService;
import com.smartlogix.bff.service.AuthService;
import com.smartlogix.bff.client.UsuariosClient;
import com.smartlogix.bff.client.InventarioClient;
import org.springframework.http.HttpStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class BffController {

    private final BffService bffService;
    private final AuthService authService;
    private final UsuariosClient usuariosClient;
    private final InventarioClient inventarioClient;


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
        try {
            User user = authService.authenticate(loginRequest.getUsername(), loginRequest.getPassword());
            return ResponseEntity.ok(new LoginResponse(true, "Login exitoso", user.getUsername(), user.getRole()));
        } catch (Exception ex) {
            return ResponseEntity.status(401).body(new LoginResponse(false, "Usuario o contraseña inválidos"));
        }
    }

    @GetMapping("/auth/verify")
    public ResponseEntity<LoginResponse> verify(@RequestParam String username) {
        try {
            User user = authService.getUserByUsername(username);
            return ResponseEntity.ok(new LoginResponse(true, "Usuario válido", user.getUsername(), user.getRole()));
        } catch (Exception ex) {
            return ResponseEntity.status(404).body(new LoginResponse(false, "Usuario no encontrado"));
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<UsuarioDTO>> listarUsuarios() {
        return ResponseEntity.ok(authService.getAllUsers());
    }

    @PostMapping("/users")
    public ResponseEntity<UsuarioDTO> crearUsuario(@RequestBody UsuarioDTO usuarioDTO,
                                                   @RequestParam(required = false) String password) {
        UsuarioDTO creado = usuariosClient.crearUsuario(usuarioDTO, password);
        return new ResponseEntity<>(creado, HttpStatus.CREATED);
    }

    @PutMapping("/users/{username}")
    public ResponseEntity<UsuarioDTO> actualizarUsuario(@PathVariable String username,
                                                        @RequestBody UsuarioDTO usuarioDTO,
                                                        @RequestParam(required = false) String password) {
        UsuarioDTO actualizado = usuariosClient.actualizarUsuario(username, usuarioDTO, password);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/users/{username}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable String username) {
        usuariosClient.eliminarUsuario(username);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/store/productos")
    public ResponseEntity<ProductoDTO> crearProducto(@RequestBody ProductoDTO productoDTO) {
        ProductoDTO creado = inventarioClient.crearProducto(productoDTO);
        return new ResponseEntity<>(creado, HttpStatus.CREATED);
    }

    @PutMapping("/store/productos/{sku}")
    public ResponseEntity<ProductoDTO> actualizarProducto(@PathVariable String sku,
                                                         @RequestBody ProductoDTO productoDTO) {
        ProductoDTO actualizado = inventarioClient.actualizarProducto(sku, productoDTO);
        return ResponseEntity.ok(actualizado);
    }

    @PutMapping("/store/productos/{sku}/descontar-stock")
    public ResponseEntity<Void> descontarStock(@PathVariable String sku, @RequestParam Integer cantidad) {
        inventarioClient.descontarStock(sku, cantidad);
        return ResponseEntity.noContent().build();
    }
}
