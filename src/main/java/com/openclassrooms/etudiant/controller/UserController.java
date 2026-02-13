package com.openclassrooms.etudiant.controller;

import com.openclassrooms.etudiant.dto.LoginRequestDTO;
import com.openclassrooms.etudiant.dto.RegisterDTO;
import com.openclassrooms.etudiant.dto.UpdateDTO;
import com.openclassrooms.etudiant.mapper.UserDtoMapper;
import com.openclassrooms.etudiant.repository.UserRepository;
import com.openclassrooms.etudiant.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.security.access.prepost.PreAuthorize;

import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    private final UserService userService;
    private final UserDtoMapper userDtoMapper;

    @PostMapping("/api/register")//create
    public ResponseEntity<?> register(@Valid @RequestBody RegisterDTO registerDTO) {
        var user = userDtoMapper.toEntity(registerDTO);
        LocalDateTime now = LocalDateTime.now();
        user.setCreated_at(now);
        user.setUpdated_at(now);
        userService.register(user);
        var savedUser = userRepository.findByLogin(user.getLogin()).orElse(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(userDtoMapper.toReadDTO(savedUser));
    }

    @PostMapping("/api/login")//login
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO loginRequestDTO) {
        log.info("Login request received for user: {}", loginRequestDTO.getLogin());
        log.info("Password: {}", loginRequestDTO.getPassword());
        String jwtToken = userService.login(loginRequestDTO.getLogin(), loginRequestDTO.getPassword());
        //log.info("Login successful for user: {}", jwtToken);
        return ResponseEntity.ok(jwtToken);
    }

    // Supposons que "Ligne" correspond à une entité "Student" pour un CRUD sur la table de lignes/étudiants (exemple)
    // Ces endpoints démontrent les opérations CRUD typiques (Create, Read, Update, Delete).

    // Toutes les commandes ci-dessous doivent être faites utilisateur loggé
    // Donc, il faut vérifier l'authentification via annotation @PreAuthorize ou @Secured, mais ici on suppose JWT + Spring Security
    // On applique @PreAuthorize("isAuthenticated()") pour forcer l'accès aux utilisateurs authentifiés


    @PreAuthorize("isAuthenticated()")
    @GetMapping("/api/read/students")
    public ResponseEntity<?> getAllStudents() {
        var users = userRepository.findAll();
        return ResponseEntity.ok(users.stream().map(userDtoMapper::toReadDTO).toList());
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/api/read/student/{login}")
    public ResponseEntity<?> getStudent(@PathVariable String login) {
        var user = userRepository.findByLogin(login).orElseThrow(() -> new IllegalArgumentException("User not found"));
        return ResponseEntity.ok(userDtoMapper.toReadDTO(user));
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/api/update/student/{login}")
    public ResponseEntity<?> updateStudent(@PathVariable String login, @Valid @RequestBody UpdateDTO updateDTO) {
        var existingUser = userRepository.findByLogin(login)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        existingUser.setFirstName(updateDTO.getFirstName());
        existingUser.setLastName(updateDTO.getLastName());
        existingUser.setUpdated_at(LocalDateTime.now());
        userRepository.save(existingUser);
        return ResponseEntity.ok(userDtoMapper.toReadDTO(existingUser));
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/api/delete/student/{login}")
    public ResponseEntity<?> deleteStudent(@PathVariable String login) {
        var user = userRepository.findByLogin(login).orElseThrow(() -> new IllegalArgumentException("User not found"));
        userRepository.delete(user);
        return ResponseEntity.ok(Map.of("message", "Student deleted"));
    }

}
