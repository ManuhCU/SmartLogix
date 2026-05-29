package com.smartlogix.usuarios.controller;

import com.smartlogix.usuarios.model.dto.LoginRequest;
import com.smartlogix.usuarios.model.dto.UsuarioDTO;
import com.smartlogix.usuarios.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping
    public ResponseEntity<List<UsuarioDTO>> listarUsuarios() {
        return ResponseEntity.ok(usuarioService.obtenerTodos());
    }

    @GetMapping("/{username}")
    public ResponseEntity<UsuarioDTO> obtenerUsuario(@PathVariable String username) {
        return ResponseEntity.ok(usuarioService.obtenerPorUsername(username));
    }

    @PostMapping
    public ResponseEntity<UsuarioDTO> crearUsuario(@RequestBody UsuarioDTO usuarioDTO,
                                                   @RequestParam(required = false) String password) {
        UsuarioDTO creado = usuarioService.crearUsuario(usuarioDTO, password != null ? password : "password123");
        return new ResponseEntity<>(creado, HttpStatus.CREATED);
    }

    @PostMapping("/authenticate")
    public ResponseEntity<UsuarioDTO> autenticar(@RequestBody LoginRequest loginRequest) {
        return ResponseEntity.ok(usuarioService.autenticar(loginRequest));
    }

    @PutMapping("/{username}")
    public ResponseEntity<UsuarioDTO> actualizarUsuario(@PathVariable String username,
                                                         @RequestBody UsuarioDTO usuarioDTO,
                                                         @RequestParam(required = false) String password) {
        UsuarioDTO actualizado = usuarioService.actualizarUsuario(username, usuarioDTO, password);
        return ResponseEntity.ok(actualizado);
    }

    @DeleteMapping("/{username}")
    public ResponseEntity<Void> eliminarUsuario(@PathVariable String username) {
        usuarioService.eliminarPorUsername(username);
        return ResponseEntity.noContent().build();
    }
}
