package com.openclassrooms.etudiant.mapper;

import com.openclassrooms.etudiant.dto.RegisterDTO;
import com.openclassrooms.etudiant.entities.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;
import java.util.List;
import com.openclassrooms.etudiant.dto.UserDTO;
import java.time.LocalDateTime;
import com.openclassrooms.etudiant.dto.UpdateDTO;



@Mapper(componentModel = "default",
        unmappedTargetPolicy = ReportingPolicy.ERROR)
public interface UserDtoMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "firstName", source = "registerDTO.firstName")
    @Mapping(target = "lastName", source = "registerDTO.lastName")
    @Mapping(target = "login", source = "registerDTO.login")
    @Mapping(target = "password", source = "registerDTO.password")
    @Mapping(target = "authorities", ignore = true)
    User toEntity(RegisterDTO registerDTO);

    @Mapping(target = "id", source = "user.id")
    @Mapping(target = "firstName", source = "user.firstName")
    @Mapping(target = "lastName", source = "user.lastName")
    @Mapping(target = "login", source = "user.login")
    @Mapping(target = "created_at", source = "user.created_at")
    @Mapping(target = "updated_at", source = "user.updated_at")
    UserDTO toReadDTO(User user);

    @Mapping(target = "id", source = "user.id")
    @Mapping(target = "firstName", source = "user.firstName")
    @Mapping(target = "lastName", source = "user.lastName")
    @Mapping(target = "login", source = "user.login")
    @Mapping(target = "created_at", source = "user.created_at")
    @Mapping(target = "updated_at", source = "user.updated_at")
    List<UserDTO> toReadDTOList(List<User> users);

    @Mapping(target = "firstName", source = "updateDTO.firstName")
    @Mapping(target = "lastName", source = "updateDTO.lastName")
    @Mapping(target = "id", source = "user.id")
    @Mapping(target = "updated_at", ignore = true)
    @Mapping(target = "authorities", ignore = true)
    User toUpdateEntity(UpdateDTO updateDTO, User user);
}
