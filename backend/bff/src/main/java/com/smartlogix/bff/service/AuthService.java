package com.smartlogix.bff.service;

import com.smartlogix.bff.client.UsuariosClient;
import com.smartlogix.bff.model.LoginRequest;
import com.smartlogix.bff.model.User;
import com.smartlogix.bff.model.UsuarioDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UsuariosClient usuariosClient;

    public User authenticate(String username, String password) {
        LoginRequest loginRequest = new LoginRequest(username, password);
        UsuarioDTO usuario = usuariosClient.autenticar(loginRequest);
        return new User(usuario.getUsername(), password, usuario.getRole(), usuario.getCardHolderName(), usuario.getCardNumber(), usuario.getCardExpiry(), usuario.getCardCvv());
    }

    public List<UsuarioDTO> getAllUsers() {
        return usuariosClient.listarTodos();
    }

    public User getUserByUsername(String username) {
        UsuarioDTO usuario = usuariosClient.obtenerPorUsername(username);
        return new User(usuario.getUsername(), null, usuario.getRole(), usuario.getCardHolderName(), usuario.getCardNumber(), usuario.getCardExpiry(), usuario.getCardCvv());
    }
}
