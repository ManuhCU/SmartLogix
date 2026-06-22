package com.smartlogix.pedidos.service.impl;

import com.smartlogix.pedidos.client.InventarioClient;
import com.smartlogix.pedidos.client.ProductoResponse;
import com.smartlogix.pedidos.factory.PedidoFactory;
import com.smartlogix.pedidos.model.dto.PedidoDTO;
import com.smartlogix.pedidos.model.entity.Pedido;
import com.smartlogix.pedidos.repository.PedidoRepository;
import com.smartlogix.pedidos.service.PedidoService;
import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class PedidoServiceImpl implements PedidoService {

    private final PedidoRepository pedidoRepository;
    private final PedidoFactory pedidoFactory;
    private final InventarioClient inventarioClient;

    @Override
    @Transactional
    @CircuitBreaker(name = "inventarioCB", fallbackMethod = "crearPedidoFallback")
    public PedidoDTO crearPedido(PedidoDTO pedidoDTO) {
        log.info("Llamando a ms-inventario para validar SKU: {}", pedidoDTO.getSkuProducto());
        
        // 1. Obtener producto del inventario
        ProductoResponse producto = inventarioClient.obtenerProducto(pedidoDTO.getSkuProducto());

        // 2. Validar stock
        if (producto.getStockActual() < pedidoDTO.getCantidad()) {
            throw new RuntimeException("Stock insuficiente en el inventario.");
        }

        // 3. Descontar stock
        inventarioClient.descontarStock(pedidoDTO.getSkuProducto(), pedidoDTO.getCantidad());

        // 4. Calcular precio total
        BigDecimal precioTotal = producto.getPrecio().multiply(BigDecimal.valueOf(pedidoDTO.getCantidad()));

        // 5. Guardar el pedido
        Pedido entity = pedidoFactory.toEntity(pedidoDTO);
        entity.setPrecioTotal(precioTotal);
        entity.setEstado("COMPLETADO");

        Pedido guardado = pedidoRepository.save(entity);
        PedidoDTO responseDTO = pedidoFactory.toDTO(guardado);
        responseDTO.setMensaje("Pedido procesado exitosamente.");
        return responseDTO;
    }

    @Override
    @Transactional(readOnly = true)
    public List<PedidoDTO> obtenerTodos() {
        return pedidoRepository.findAll()
                .stream()
                .map(pedidoFactory::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Fallback Method: Se ejecuta cuando el Circuit Breaker está Abierto o si hay falla (Timeout/Error 500)
     * al comunicarse con ms-inventario.
     */
    public PedidoDTO crearPedidoFallback(PedidoDTO pedidoDTO, Throwable t) {
        log.error("Circuit Breaker activado (Fallback). Fallo al comunicarse con ms-inventario: {}", t.getMessage());
        
        Pedido entity = pedidoFactory.toEntity(pedidoDTO);
        entity.setPrecioTotal(BigDecimal.ZERO); // No sabemos el precio actual
        entity.setEstado("FALLIDO");
        
        Pedido guardado = pedidoRepository.save(entity);
        
        PedidoDTO responseDTO = pedidoFactory.toDTO(guardado);
        responseDTO.setMensaje("El servicio de inventario no está disponible. Pedido registrado como FALLIDO. Por favor, intente más tarde.");
        return responseDTO;
    }
}
