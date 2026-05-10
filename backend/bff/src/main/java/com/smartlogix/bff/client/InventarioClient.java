package com.smartlogix.bff.client;

import com.smartlogix.bff.model.ProductoDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@FeignClient(name = "ms-inventario", url = "${smartlogix.inventario.url}")
public interface InventarioClient {

    @GetMapping("/api/inventario/productos")
    List<ProductoDTO> listarTodos();

    @GetMapping("/api/inventario/productos/{sku}")
    ProductoDTO obtenerPorSku(@PathVariable("sku") String sku);
}
