package com.smartlogix.inventario.config;

import com.smartlogix.inventario.model.entity.Producto;
import com.smartlogix.inventario.repository.ProductoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;

/**
 * Componente que se ejecuta automáticamente al iniciar la aplicación.
 * Sirve para poblar la base de datos con productos de prueba si está vacía.
 */
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ProductoRepository productoRepository;

    @Override
    public void run(String... args) throws Exception {
        if (productoRepository.count() == 0) {
            System.out.println("Base de datos de inventario vacía. Cargando productos de prueba...");

            Producto p1 = Producto.builder()
                    .sku("SKU-1001")
                    .nombre("Smartphone X Pro")
                    .descripcion("Smartphone de última generación con cámara de 108MP y batería de 5000mAh.")
                    .precio(new BigDecimal("999.00"))
                    .stockActual(50)
                    .build();

            Producto p2 = Producto.builder()
                    .sku("SKU-1002")
                    .nombre("Laptop UltraBook 15\"")
                    .descripcion("Portátil ultraligero especial para desarrolladores. 16GB RAM, 1TB SSD.")
                    .precio(new BigDecimal("1250.00"))
                    .stockActual(20)
                    .build();

            Producto p3 = Producto.builder()
                    .sku("SKU-1003")
                    .nombre("Auriculares Inalámbricos Noise-Cancelling")
                    .descripcion("Auriculares Bluetooth con cancelación de ruido activa y 30h de batería.")
                    .precio(new BigDecimal("299.99"))
                    .stockActual(100)
                    .build();

            Producto p4 = Producto.builder()
                    .sku("SKU-1004")
                    .nombre("Teclado Mecánico RGB")
                    .descripcion("Teclado mecánico para gaming con switches rojos y retroiluminación.")
                    .precio(new BigDecimal("120.00"))
                    .stockActual(0) // Agotado para probar la interfaz
                    .build();

            productoRepository.saveAll(Arrays.asList(p1, p2, p3, p4));
            
            System.out.println("¡Productos de prueba cargados exitosamente!");
        }
    }
}
