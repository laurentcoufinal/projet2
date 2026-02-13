package com.openclassrooms.etudiant.mapper;

import com.openclassrooms.etudiant.dto.RegisterDTO;
import com.openclassrooms.etudiant.dto.UpdateDTO;
import com.openclassrooms.etudiant.dto.UserDTO;
import com.openclassrooms.etudiant.entities.User;
import java.util.Collections;
import java.util.List;

/**
 * Implémentation manuelle de UserDtoMapper utilisée lorsque MapStruct
 * n'a pas encore généré UserDtoMapperImpl (ex. avant mvn compile).
 * Le bean est exposé par MapperConfig si aucun autre UserDtoMapper n'est présent.
 */
public class ManualUserDtoMapper implements UserDtoMapper {

    @Override
    public User toEntity(RegisterDTO registerDTO) {
        if (registerDTO == null) return null;
        User user = new User();
        user.setFirstName(registerDTO.getFirstName());
        user.setLastName(registerDTO.getLastName());
        user.setLogin(registerDTO.getLogin());
        user.setPassword(registerDTO.getPassword());
        return user;
    }

    @Override
    public UserDTO toReadDTO(User user) {
        if (user == null) return null;
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setLogin(user.getLogin());
        dto.setCreated_at(user.getCreated_at());
        dto.setUpdated_at(user.getUpdated_at());
        return dto;
    }

    @Override
    public List<UserDTO> toReadDTOList(List<User> users) {
        if (users == null) return Collections.emptyList();
        return users.stream().map(this::toReadDTO).toList();
    }

    @Override
    public User toUpdateEntity(UpdateDTO updateDTO, User user) {
        if (updateDTO == null || user == null) return null;
        User updated = new User();
        updated.setId(user.getId());
        updated.setFirstName(updateDTO.getFirstName());
        updated.setLastName(updateDTO.getLastName());
        updated.setLogin(user.getLogin());
        updated.setPassword(user.getPassword());
        updated.setCreated_at(user.getCreated_at());
        return updated;
    }
}
