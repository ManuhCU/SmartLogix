package com.smartlogix.pedidos.controller;

import com.smartlogix.pedidos.model.dto.PedidoDTO;
import com.smartlogix.pedidos.service.PedidoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
@RequiredArgsConstructor
public class PedidoController {

    private final PedidoService pedidoService;

    @GetMapping
    public ResponseEntity<List<PedidoDTO>> listarTodos() {
        return ResponseEntity.ok(pedidoService.obtenerTodos());
    }

    @PostMapping
    public ResponseEntity<PedidoDTO> crearPedido(@RequestBody PedidoDTO pedidoDTO) {
        PedidoDTO response = pedidoService.crearPedido(pedidoDTO);
        
        if ("FALLIDO".equals(response.getEstado())) {
            // Si entra por el fallback del Circuit Breaker, devolvemos 202 Accepted o 503, según el diseño.
            // Retornaremos 202 para indicar que fue recibido pero no pudo completarse satisfactoriamente por dependencias.
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
        }
        
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
