package com.smartlogix.bff.client;

import com.smartlogix.bff.model.LoginRequest;
import com.smartlogix.bff.model.UsuarioDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@FeignClient(name = "ms-usuarios", url = "${smartlogix.usuarios.url}")
public interface UsuariosClient {

    @GetMapping("/api/usuarios")
    List<UsuarioDTO> listarTodos();

    @GetMapping("/api/usuarios/{username}")
    UsuarioDTO obtenerPorUsername(@PathVariable("username") String username);

    @PostMapping("/api/usuarios")
    UsuarioDTO crearUsuario(@RequestBody UsuarioDTO usuarioDTO, @RequestParam(value = "password", required = false) String password);

    @PostMapping("/api/usuarios/authenticate")
    UsuarioDTO autenticar(@RequestBody LoginRequest loginRequest);

    @PutMapping("/api/usuarios/{username}")
    UsuarioDTO actualizarUsuario(@PathVariable("username") String username,
                                 @RequestBody UsuarioDTO usuarioDTO,
                                 @RequestParam(value = "password", required = false) String password);

    @DeleteMapping("/api/usuarios/{username}")
    void eliminarUsuario(@PathVariable("username") String username);
}
