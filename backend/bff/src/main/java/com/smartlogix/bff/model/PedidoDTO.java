package com.smartlogix.bff.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PedidoDTO {
    private Long id;
    private String username;
    private String skuProducto;
    private String nombreProducto;
    private Integer cantidad;
    private BigDecimal precioTotal;
    private String estado;
    private String mensaje;
}
