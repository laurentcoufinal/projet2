package com.openclassrooms.etudiant.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateDTO {
    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;    
}
