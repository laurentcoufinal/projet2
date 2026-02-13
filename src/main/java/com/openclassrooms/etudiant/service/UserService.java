package com.openclassrooms.etudiant.service;

import com.openclassrooms.etudiant.entities.User;
import com.openclassrooms.etudiant.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import java.util.Optional;

@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public void register(User user) {
        Assert.notNull(user, "User must not be null");
    
        if (userRepository.findByLogin(user.getLogin()).isPresent()) {
            throw new IllegalArgumentException("User already exists");
        }
    
        // On encode LE MOT DE PASSE, pas un token
        user.setPassword(passwordEncoder.encode(user.getPassword()));
    
        userRepository.save(user);
    }

    public String login(String login, String password) {
        Assert.notNull(login, "Login must not be null");
        Assert.notNull(password, "Password must not be null");
    
        User user = userRepository.findByLogin(login)
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
    
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Invalid credentials");
        }
    
        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(user.getLogin())
                .password(user.getPassword())
                .authorities("USER")
                .build();
    
        // Le token est généré et retourné, PAS stocké
        //System.out.println("************* passer ici");
        return jwtService.generateToken(userDetails);
    }


}
