package com.smartlogix.bff.client;

import com.smartlogix.bff.model.PedidoDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import java.util.List;

@FeignClient(name = "ms-pedidos", url = "${smartlogix.pedidos.url}")
public interface PedidosClient {

    @GetMapping("/api/pedidos")
    List<PedidoDTO> listarTodos();

    @PostMapping("/api/pedidos")
    PedidoDTO crearPedido(@RequestBody PedidoDTO pedidoDTO);
}
