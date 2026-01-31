package com.openclassrooms.etudiant.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.util.Date;

@Service
public class JwtService {

    public String generateToken(UserDetails userDetails) {
        // Génération d'un JWT simple, typique avec io.jsonwebtoken.Jwts
        // Clé secrète de test (à externaliser dans une vraie app !)
        String SECRET_KEY = "mySecretKey123456789012345678901234567890";
        long expirationMillis = 1000 * 60 * 60 * 24; // 1 jour
        return Jwts.builder()
        .setSubject(userDetails.getUsername()) // login
        .setIssuedAt(new Date(System.currentTimeMillis()))
        .setExpiration(new Date(System.currentTimeMillis() + expirationMillis)) // 1 jour
        .signWith(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()), SignatureAlgorithm.HS256)
        .compact();
    }
}
