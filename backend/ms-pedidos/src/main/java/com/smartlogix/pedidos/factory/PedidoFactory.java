package com.smartlogix.pedidos.factory;

import com.smartlogix.pedidos.model.dto.PedidoDTO;
import com.smartlogix.pedidos.model.entity.Pedido;
import org.springframework.stereotype.Component;

@Component
public class PedidoFactory {

    public PedidoDTO toDTO(Pedido pedido) {
        if (pedido == null) return null;
        
        return PedidoDTO.builder()
                .id(pedido.getId())
                .skuProducto(pedido.getSkuProducto())
                .cantidad(pedido.getCantidad())
                .precioTotal(pedido.getPrecioTotal())
                .estado(pedido.getEstado())
                .build();
    }

    public Pedido toEntity(PedidoDTO dto) {
        if (dto == null) return null;

        return Pedido.builder()
                .id(dto.getId())
                .skuProducto(dto.getSkuProducto())
                .cantidad(dto.getCantidad())
                .precioTotal(dto.getPrecioTotal())
                .estado(dto.getEstado() != null ? dto.getEstado() : "PENDIENTE")
                .build();
    }
}
