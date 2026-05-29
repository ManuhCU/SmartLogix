package com.smartlogix.usuarios.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "usuarios", uniqueConstraints = {@UniqueConstraint(columnNames = "username")})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private Boolean active;
}
