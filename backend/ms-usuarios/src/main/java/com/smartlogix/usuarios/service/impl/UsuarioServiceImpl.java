package com.smartlogix.usuarios.service.impl;

import com.smartlogix.usuarios.model.dto.LoginRequest;
import com.smartlogix.usuarios.model.dto.UsuarioDTO;
import com.smartlogix.usuarios.model.entity.Usuario;
import com.smartlogix.usuarios.repository.UsuarioRepository;
import com.smartlogix.usuarios.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;

    @Override
    public List<UsuarioDTO> obtenerTodos() {
        return usuarioRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public UsuarioDTO obtenerPorUsername(String username) {
        return usuarioRepository.findByUsername(username)
                .map(this::toDTO)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
    }

    @Override
    public UsuarioDTO crearUsuario(UsuarioDTO usuarioDTO, String password) {
        if (usuarioRepository.existsByUsername(usuarioDTO.getUsername())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El usuario ya existe");
        }
        Usuario usuario = Usuario.builder()
                .username(usuarioDTO.getUsername())
                .password(password)
                .role(usuarioDTO.getRole() == null ? "USER" : usuarioDTO.getRole())
                .active(usuarioDTO.getActive() == null ? true : usuarioDTO.getActive())
                .cardHolderName(usuarioDTO.getCardHolderName())
                .cardNumber(usuarioDTO.getCardNumber())
                .cardExpiry(usuarioDTO.getCardExpiry())
                .cardCvv(usuarioDTO.getCardCvv())
                .build();
        Usuario guardado = usuarioRepository.save(usuario);
        return toDTO(guardado);
    }

    @Override
    public UsuarioDTO autenticar(LoginRequest loginRequest) {
        Usuario usuario = usuarioRepository.findByUsername(loginRequest.getUsername())
                .filter(u -> u.getPassword().equals(loginRequest.getPassword()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas"));

        if (usuario.getActive() != null && !usuario.getActive()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cuenta inactiva. Contacte al administrador.");
        }

        return toDTO(usuario);
    }

    @Override
    public void eliminarPorUsername(String username) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
        usuarioRepository.delete(usuario);
    }

    @Override
    public UsuarioDTO actualizarUsuario(String username, UsuarioDTO usuarioDTO, String password) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

        if (usuarioDTO.getRole() != null) {
            usuario.setRole(usuarioDTO.getRole());
        }
        if (usuarioDTO.getActive() != null) {
            usuario.setActive(usuarioDTO.getActive());
        }
        if (usuarioDTO.getCardHolderName() != null) {
            usuario.setCardHolderName(usuarioDTO.getCardHolderName());
        }
        if (usuarioDTO.getCardNumber() != null) {
            usuario.setCardNumber(usuarioDTO.getCardNumber());
        }
        if (usuarioDTO.getCardExpiry() != null) {
            usuario.setCardExpiry(usuarioDTO.getCardExpiry());
        }
        if (usuarioDTO.getCardCvv() != null) {
            usuario.setCardCvv(usuarioDTO.getCardCvv());
        }
        if (password != null && !password.isEmpty()) {
            usuario.setPassword(password);
        }

        Usuario actualizado = usuarioRepository.save(usuario);
        return toDTO(actualizado);
    }

    private UsuarioDTO toDTO(Usuario usuario) {
        return UsuarioDTO.builder()
                .id(usuario.getId())
                .username(usuario.getUsername())
                .role(usuario.getRole())
                .active(usuario.getActive())
                .cardHolderName(usuario.getCardHolderName())
                .cardNumber(usuario.getCardNumber())
                .cardExpiry(usuario.getCardExpiry())
                .cardCvv(usuario.getCardCvv())
                .build();
    }
}
