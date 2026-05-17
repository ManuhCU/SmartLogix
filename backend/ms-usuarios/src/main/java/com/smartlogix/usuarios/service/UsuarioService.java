package com.smartlogix.usuarios.service;

import com.smartlogix.usuarios.model.dto.LoginRequest;
import com.smartlogix.usuarios.model.dto.UsuarioDTO;

import java.util.List;

public interface UsuarioService {
    List<UsuarioDTO> obtenerTodos();
    UsuarioDTO obtenerPorUsername(String username);
    UsuarioDTO crearUsuario(UsuarioDTO usuarioDTO, String password);
    UsuarioDTO autenticar(LoginRequest loginRequest);
    void eliminarPorUsername(String username);
    UsuarioDTO actualizarUsuario(String username, UsuarioDTO usuarioDTO, String password);
}
