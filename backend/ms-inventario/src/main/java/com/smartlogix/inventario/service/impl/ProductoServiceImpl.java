package com.smartlogix.inventario.service.impl;

import com.smartlogix.inventario.factory.ProductoFactory;
import com.smartlogix.inventario.model.dto.ProductoDTO;
import com.smartlogix.inventario.model.entity.Producto;
import com.smartlogix.inventario.repository.ProductoRepository;
import com.smartlogix.inventario.service.ProductoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Patrón Dependency Injection: Utilizando el constructor para inyectar Repository y Factory.
 * Esto facilita las pruebas unitarias y garantiza que las dependencias estén listas.
 */
@Service
@RequiredArgsConstructor
public class ProductoServiceImpl implements ProductoService {

    private final ProductoRepository productoRepository;
    private final ProductoFactory productoFactory;

    @Override
    @Transactional(readOnly = true)
    public List<ProductoDTO> obtenerTodos() {
        return productoRepository.findAll()
                .stream()
                .map(productoFactory::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ProductoDTO obtenerPorSku(String sku) {
        Producto producto = productoRepository.findBySku(sku)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con SKU: " + sku));
        return productoFactory.toDTO(producto);
    }

    @Override
    @Transactional
    public ProductoDTO crearProducto(ProductoDTO productoDTO) {
        if (productoDTO.getSku() == null || productoDTO.getSku().isBlank()) {
            throw new RuntimeException("SKU es obligatorio");
        }

        return productoRepository.findBySku(productoDTO.getSku()).map(existing -> {
            // Si el SKU ya existe, interpretamos la operación como "agregar stock"
            Integer adicional = productoDTO.getStockActual() != null ? productoDTO.getStockActual() : 0;
            existing.setStockActual(existing.getStockActual() + adicional);
            // Si se envían campos nuevos, actualizarlos también (nombre, descripción, precio)
            if (productoDTO.getNombre() != null && !productoDTO.getNombre().isBlank()) {
                existing.setNombre(productoDTO.getNombre());
            }
            if (productoDTO.getDescripcion() != null) {
                existing.setDescripcion(productoDTO.getDescripcion());
            }
            if (productoDTO.getPrecio() != null) {
                existing.setPrecio(productoDTO.getPrecio());
            }
            Producto actualizado = productoRepository.save(existing);
            return productoFactory.toDTO(actualizado);
        }).orElseGet(() -> {
            Producto entity = productoFactory.toEntity(productoDTO);
            Producto guardado = productoRepository.save(entity);
            return productoFactory.toDTO(guardado);
        });
    }

    @Override
    @Transactional
    public ProductoDTO actualizarProducto(String sku, ProductoDTO productoDTO) {
        Producto producto = productoRepository.findBySku(sku)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con SKU: " + sku));

        producto.setNombre(productoDTO.getNombre());
        producto.setDescripcion(productoDTO.getDescripcion());
        producto.setPrecio(productoDTO.getPrecio());
        if (productoDTO.getStockActual() != null) {
            producto.setStockActual(productoDTO.getStockActual());
        }

        Producto actualizado = productoRepository.save(producto);
        return productoFactory.toDTO(actualizado);
    }

    @Override
    @Transactional
    public void actualizarStock(String sku, Integer cantidadComprada) {
        Producto producto = productoRepository.findBySku(sku)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado con SKU: " + sku));
        
        if (producto.getStockActual() < cantidadComprada) {
            throw new RuntimeException("Stock insuficiente para el SKU: " + sku);
        }
        
        producto.setStockActual(producto.getStockActual() - cantidadComprada);
        productoRepository.save(producto);
    }
}
