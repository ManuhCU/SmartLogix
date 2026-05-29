package com.smartlogix.bff.model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UsuarioDTO {
    private Long id;
    private String username;
    private String role;
    private Boolean active;
}
