package com.smartlogix.bff.service;

import com.smartlogix.bff.client.InventarioClient;
import com.smartlogix.bff.client.PedidosClient;
import com.smartlogix.bff.model.PedidoDTO;
import com.smartlogix.bff.model.ProductoDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BffService {

    private final InventarioClient inventarioClient;
    private final PedidosClient pedidosClient;

    public List<ProductoDTO> obtenerCatalogo() {
        return inventarioClient.listarTodos();
    }

    public PedidoDTO realizarCompra(PedidoDTO pedidoDTO) {
        return pedidosClient.crearPedido(pedidoDTO);
    }
}
