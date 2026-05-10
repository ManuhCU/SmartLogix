package com.smartlogix.bff.controller;

import com.smartlogix.bff.model.PedidoDTO;
import com.smartlogix.bff.model.ProductoDTO;
import com.smartlogix.bff.service.BffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/store")
@RequiredArgsConstructor
public class BffController {

    private final BffService bffService;

    @GetMapping("/catalogo")
    public ResponseEntity<List<ProductoDTO>> obtenerCatalogo() {
        return ResponseEntity.ok(bffService.obtenerCatalogo());
    }

    @PostMapping("/comprar")
    public ResponseEntity<PedidoDTO> realizarCompra(@RequestBody PedidoDTO pedidoDTO) {
        PedidoDTO response = bffService.realizarCompra(pedidoDTO);
        return ResponseEntity.ok(response);
    }
}
