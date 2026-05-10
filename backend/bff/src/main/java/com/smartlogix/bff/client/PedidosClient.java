package com.smartlogix.bff.client;

import com.smartlogix.bff.model.PedidoDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@FeignClient(name = "ms-pedidos", url = "${smartlogix.pedidos.url}")
public interface PedidosClient {

    @PostMapping("/api/pedidos")
    PedidoDTO crearPedido(@RequestBody PedidoDTO pedidoDTO);
}
