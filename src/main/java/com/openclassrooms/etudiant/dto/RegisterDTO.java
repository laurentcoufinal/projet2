package com.openclassrooms.etudiant.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;
import lombok.Data;
import java.time.LocalDateTime;
import org.springframework.security.core.GrantedAuthority;
import java.util.Collection;
@Data
public class RegisterDTO {
    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
    @NotBlank
    private String login;
    @NotBlank
    private String password;
    @NotBlank
    private LocalDateTime created_at;
    @NotBlank
    private LocalDateTime updated_at;
    @NotBlank
    private Collection<? extends GrantedAuthority> authorities;
}
