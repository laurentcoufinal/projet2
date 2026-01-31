# Analyse des Fonctionnalités du Projet Etudiant Backend

## Fonctionnalité Principale

Le projet **etudiant-backend** est une application Spring Boot qui gère les APIs des utilisateurs (agents de la bibliothèque) avec un système d'authentification basé sur JWT. L'application permet l'enregistrement et l'authentification des utilisateurs, avec une architecture sécurisée utilisant Spring Security.

---

## Détail des Fonctionnalités par Fichier

### 1. Inscription d'un Utilisateur (Register)

**Endpoint**: `POST /api/register`

**Fichiers impliqués**:
- **Controller**: `src/main/java/com/openclassrooms/etudiant/controller/UserController.java`
  - Méthode: `register(@Valid @RequestBody RegisterDTO registerDTO)`
  - Valide les données d'entrée et appelle le service d'inscription
  
- **Service**: `src/main/java/com/openclassrooms/etudiant/service/UserService.java`
  - Méthode: `register(User user)`
  - Vérifie l'unicité du login
  - Encode le mot de passe avec BCrypt
  - Enregistre l'utilisateur en base de données
  
- **Mapper**: `src/main/java/com/openclassrooms/etudiant/mapper/UserDtoMapper.java`
  - Méthode: `toEntity(RegisterDTO registerDTO)`
  - Convertit le DTO d'inscription en entité User
  
- **DTO**: `src/main/java/com/openclassrooms/etudiant/dto/RegisterDTO.java`
  - Contient: firstName, lastName, login, password
  - Validation avec annotations `@NotBlank`
  
- **Repository**: `src/main/java/com/openclassrooms/etudiant/repository/UserRepository.java`
  - Méthode: `findByLogin(String login)` - Vérifie l'existence d'un utilisateur
  - Méthode héritée: `save(User user)` - Enregistre l'utilisateur

**Fonctionnalité**: Permet à un nouvel agent de bibliothèque de s'inscrire avec ses informations personnelles. Le système vérifie que le login est unique et encode le mot de passe avant de le stocker.

---

### 2. Authentification d'un Utilisateur (Login)

**Endpoint**: `POST /api/login`

**Fichiers impliqués**:
- **Controller**: `src/main/java/com/openclassrooms/etudiant/controller/UserController.java`
  - Méthode: `login(LoginRequestDTO loginRequestDTO)`
  - Reçoit les identifiants et retourne un token JWT
  
- **Service**: `src/main/java/com/openclassrooms/etudiant/service/UserService.java`
  - Méthode: `login(String login, String password)`
  - Vérifie les identifiants
  - Compare le mot de passe avec celui enregistré
  - Génère un token JWT via JwtService
  
- **Service JWT**: `src/main/java/com/openclassrooms/etudiant/service/JwtService.java`
  - Méthode: `generateToken(UserDetails userDetails)`
  - ⚠️ **À implémenter** (retourne actuellement `null`)
  
- **DTO**: `src/main/java/com/openclassrooms/etudiant/dto/LoginRequestDTO.java`
  - Contient: login, password
  
- **Repository**: `src/main/java/com/openclassrooms/etudiant/repository/UserRepository.java`
  - Méthode: `findByLogin(String login)` - Récupère l'utilisateur par son login

**Fonctionnalité**: Permet à un utilisateur de s'authentifier avec son login et mot de passe. Le système vérifie les identifiants et génère un token JWT (actuellement non implémenté).

**Note**: Il y a un bug dans la méthode `login` du UserService (ligne 40) : `passwordEncoder.matches(password, password)` devrait être `passwordEncoder.matches(password, user.get().getPassword())`.

---

### 3. Gestion de la Sécurité (Spring Security)

**Fichiers impliqués**:
- **Configuration**: `src/main/java/com/openclassrooms/etudiant/configuration/security/SpringSecurityConfig.java`
  - Configure la chaîne de sécurité HTTP
  - Désactive CORS et CSRF
  - Configure la session comme stateless (pour JWT)
  - Autorise l'accès public à `/api/register`, `/api/login` et `/actuator/**`
  - Protège toutes les autres routes
  - Configure l'encodeur de mot de passe (BCrypt)
  - Configure l'AuthenticationManager et le DaoAuthenticationProvider
  
- **Service Utilisateur**: `src/main/java/com/openclassrooms/etudiant/configuration/security/CustomUserDetailService.java`
  - Implémente `UserDetailsService`
  - Méthode: `loadUserByUsername(String login)`
  - Charge un utilisateur depuis la base de données pour Spring Security

**Fonctionnalité**: Configure la sécurité de l'application avec Spring Security, permettant l'authentification et l'autorisation basées sur JWT.

---

### 4. Gestion des Erreurs

**Fichiers impliqués**:
- **Handler**: `src/main/java/com/openclassrooms/etudiant/handler/RestExceptionHandler.java`
  - Gère les exceptions globalement avec `@RestControllerAdvice`
  - Méthodes:
    - `handleConflict()` - Gère `IllegalArgumentException` et `IllegalStateException` (400 BAD_REQUEST)
    - `handleBadCredentialsException()` - Gère `BadCredentialsException` (401 UNAUTHORIZED)
    - `handleForbiddenException()` - Gère `AccessDeniedException` (403 FORBIDDEN)
    - `handleException()` - Gère toutes les autres exceptions (500 INTERNAL_SERVER_ERROR)
  
- **DTO d'erreur**: `src/main/java/com/openclassrooms/etudiant/handler/ErrorDetails.java`
  - Contient: timestamp, message, details

**Fonctionnalité**: Centralise la gestion des erreurs et retourne des réponses HTTP cohérentes avec des détails d'erreur structurés.

---

### 5. Modèle de Données (Entité User)

**Fichier**: `src/main/java/com/openclassrooms/etudiant/entities/User.java`

**Propriétés**:
- `id` (Long) - Identifiant unique, généré automatiquement
- `firstName` (String) - Prénom, obligatoire
- `lastName` (String) - Nom, obligatoire
- `login` (String) - Identifiant de connexion, unique et obligatoire
- `password` (String) - Mot de passe, obligatoire
- `created_at` (LocalDateTime) - Date de création, générée automatiquement
- `updated_at` (LocalDateTime) - Date de mise à jour, générée automatiquement

**Implémentations**:
- Implémente `UserDetails` de Spring Security
- Méthodes Spring Security: `getAuthorities()`, `getUsername()`, `isAccountNonExpired()`, `isAccountNonLocked()`, `isCredentialsNonExpired()`, `isEnabled()`

**Fonctionnalité**: Représente un utilisateur (agent de bibliothèque) dans le système avec toutes les informations nécessaires pour l'authentification et la gestion de compte.

---

### 6. Configuration de l'Application

**Fichiers impliqués**:
- **Application principale**: `src/main/java/com/openclassrooms/etudiant/EtudiantBackendApplication.java`
  - Point d'entrée de l'application Spring Boot
  - Annotation `@SpringBootApplication`
  
- **Configuration**: `src/main/java/com/openclassrooms/etudiant/configuration/AppConfig.java`
  - Configure le chargement des propriétés depuis le fichier `.env`
  
- **Configuration YAML**: `src/main/resources/application.yml`
  - Configuration de la base de données MySQL
  - Configuration JPA/Hibernate (ddl-auto: update)
  - Configuration du logging
  - Configuration des endpoints Actuator

**Fonctionnalité**: Configure l'application Spring Boot, la connexion à la base de données MySQL, et les paramètres de logging et monitoring.

---

### 7. Logging des Requêtes

**Fichier**: `src/main/java/com/openclassrooms/etudiant/configuration/logging/RequestLoggingFilterConfig.java`
- Configure le logging des requêtes HTTP (si présent)

**Fonctionnalité**: Permet de logger les requêtes HTTP entrantes pour le débogage et le monitoring.

---

## Architecture du Projet

```
Controller (UserController)
    ↓
Service (UserService)
    ↓
Repository (UserRepository)
    ↓
Base de données MySQL
```

**Flux d'inscription**:
1. Client → POST /api/register avec RegisterDTO
2. UserController → UserService.register()
3. UserService → Vérifie l'unicité du login
4. UserService → Encode le mot de passe
5. UserService → UserRepository.save()
6. Réponse HTTP 201 CREATED

**Flux d'authentification**:
1. Client → POST /api/login avec LoginRequestDTO
2. UserController → UserService.login()
3. UserService → Vérifie les identifiants
4. UserService → JwtService.generateToken() (à implémenter)
5. Réponse avec token JWT

---

## Technologies Utilisées

- **Spring Boot 3.5.5** - Framework principal
- **Spring Security** - Gestion de la sécurité et authentification
- **Spring Data JPA** - Accès aux données
- **Hibernate** - ORM
- **MySQL** - Base de données
- **BCrypt** - Encodage des mots de passe
- **JWT** - Tokens d'authentification (à implémenter)
- **MapStruct** - Mapping DTO/Entity
- **Lombok** - Réduction du code boilerplate
- **Docker Compose** - Conteneurisation de la base de données

---

## État d'Implémentation

✅ **Implémenté**:
- Inscription d'utilisateur
- Structure d'authentification
- Configuration de sécurité
- Gestion des erreurs
- Modèle de données

⚠️ **À compléter**:
- Génération de token JWT (JwtService.generateToken())
- Validation du mot de passe dans login() (bug à corriger)
- APIs CRUD des étudiants (mentionnées dans le README)

---

## Base de Données

- **Table**: `user`
- **Schéma**: `etudiant_db`
- **Création**: Automatique via Hibernate (ddl-auto: update)
- **Connexion**: MySQL via Docker Compose

---

## Propositions d'Améliorations

### 🔴 Améliorations Critiques (À corriger en priorité)

#### 1. **Correction du bug de validation du mot de passe**
- **Fichier concerné**: `src/main/java/com/openclassrooms/etudiant/service/UserService.java` (ligne 40)
- **Problème**: `passwordEncoder.matches(password, password)` compare le mot de passe avec lui-même
- **Solution**: Remplacer par `passwordEncoder.matches(password, user.get().getPassword())`
- **Impact**: Actuellement, l'authentification ne fonctionne pas correctement

#### 2. **Implémentation de la génération de token JWT**
- **Fichier concerné**: `src/main/java/com/openclassrooms/etudiant/service/JwtService.java`
- **Problème**: La méthode `generateToken()` retourne `null`
- **Solution**: 
  - Ajouter la dépendance `io.jsonwebtoken:jjwt-api` et `io.jsonwebtoken:jjwt-impl` dans `pom.xml`
  - Implémenter la génération de token avec expiration
  - Ajouter une méthode `validateToken()` pour valider les tokens
  - Ajouter une méthode `extractUsername()` pour extraire le login du token
- **Impact**: L'authentification ne peut pas fonctionner sans cette implémentation

#### 3. **Ajout d'un filtre JWT pour protéger les routes**
- **Fichier concerné**: `src/main/java/com/openclassrooms/etudiant/configuration/security/SpringSecurityConfig.java`
- **Problème**: Le filtre JWT est commenté (ligne 57) et non implémenté
- **Solution**: 
  - Créer une classe `JwtAuthenticationFilter` qui étend `OncePerRequestFilter`
  - Extraire le token du header `Authorization`
  - Valider le token et charger l'utilisateur
  - Configurer le filtre dans `SpringSecurityConfig`
- **Impact**: Les routes protégées ne sont pas réellement sécurisées

#### 4. **Validation des DTOs d'entrée**
- **Fichier concerné**: `src/main/java/com/openclassrooms/etudiant/dto/LoginRequestDTO.java`
- **Problème**: Pas de validation `@NotBlank` sur les champs login et password
- **Solution**: Ajouter `@NotBlank` sur les champs login et password
- **Impact**: Permet l'envoi de requêtes avec des champs vides

#### 5. **Gestion des exceptions de validation Bean Validation**
- **Fichier concerné**: `src/main/java/com/openclassrooms/etudiant/handler/RestExceptionHandler.java`
- **Problème**: Les erreurs de validation `@Valid` ne sont pas gérées explicitement
- **Solution**: Ajouter un handler pour `MethodArgumentNotValidException` et `ConstraintViolationException`
- **Impact**: Les erreurs de validation retournent des réponses génériques

---

### 🟠 Améliorations Importantes (Recommandées)

#### 6. **Amélioration de la réponse du login**
- **Fichier concerné**: `src/main/java/com/openclassrooms/etudiant/controller/UserController.java`
- **Problème**: Le login retourne uniquement le token en String
- **Solution**: 
  - Créer un DTO `LoginResponseDTO` avec token, type de token, date d'expiration
  - Retourner un objet structuré au lieu d'une simple String
- **Impact**: Meilleure expérience API et facilité d'utilisation côté client

#### 7. **Gestion des rôles et autorisations**
- **Fichier concerné**: `src/main/java/com/openclassrooms/etudiant/entities/User.java`
- **Problème**: `getAuthorities()` retourne une liste vide
- **Solution**: 
  - Ajouter une entité `Role` ou un enum `Role`
  - Créer une table de jointure `user_roles` ou un champ `role` dans User
  - Implémenter correctement `getAuthorities()`
  - Configurer les autorisations dans `SpringSecurityConfig` (ex: `/api/admin/**` nécessite ROLE_ADMIN)
- **Impact**: Permet la gestion fine des permissions

#### 8. **Validation de la force du mot de passe**
- **Fichier concerné**: `src/main/java/com/openclassrooms/etudiant/dto/RegisterDTO.java`
- **Problème**: Aucune validation de la complexité du mot de passe
- **Solution**: 
  - Créer une annotation personnalisée `@ValidPassword` ou utiliser une regex
  - Exiger: minimum 8 caractères, majuscule, minuscule, chiffre, caractère spécial
- **Impact**: Sécurité renforcée contre les attaques par force brute

#### 9. **Configuration CORS appropriée**
- **Fichier concerné**: `src/main/java/com/openclassrooms/etudiant/configuration/security/SpringSecurityConfig.java`
- **Problème**: CORS est complètement désactivé (ligne 46)
- **Solution**: 
  - Créer une classe `CorsConfig` avec `@CrossOrigin` ou configuration dans `SpringSecurityConfig`
  - Autoriser uniquement les origines nécessaires
  - Configurer les headers et méthodes autorisés
- **Impact**: Nécessaire pour les applications frontend, sécurité améliorée

#### 10. **Gestion de la déconnexion (Logout)**
- **Fichier concerné**: Nouveau fichier à créer
- **Problème**: Pas d'endpoint de déconnexion
- **Solution**: 
  - Créer un endpoint `POST /api/logout`
  - Optionnel: Blacklister le token JWT (nécessite un cache Redis ou une table de tokens révoqués)
  - Retourner une réponse de succès
- **Impact**: Meilleure gestion de la session utilisateur

#### 11. **Endpoint de profil utilisateur**
- **Fichier concerné**: `src/main/java/com/openclassrooms/etudiant/controller/UserController.java`
- **Problème**: Pas d'endpoint pour récupérer les informations de l'utilisateur connecté
- **Solution**: 
  - Créer `GET /api/user/me` qui retourne les informations de l'utilisateur authentifié
  - Créer un DTO `UserResponseDTO` (sans le mot de passe)
  - Utiliser `@AuthenticationPrincipal` pour récupérer l'utilisateur
- **Impact**: Fonctionnalité essentielle pour les applications frontend

#### 12. **Gestion de la mise à jour du profil**
- **Fichier concerné**: `src/main/java/com/openclassrooms/etudiant/controller/UserController.java`
- **Problème**: Pas d'endpoint pour modifier le profil
- **Solution**: 
  - Créer `PUT /api/user/me` pour mettre à jour firstName, lastName
  - Créer un DTO `UpdateUserDTO`
  - Valider les données et mettre à jour en base
- **Impact**: Permet aux utilisateurs de modifier leurs informations

#### 13. **Gestion du changement de mot de passe**
- **Fichier concerné**: Nouveau fichier à créer
- **Problème**: Pas de fonctionnalité pour changer le mot de passe
- **Solution**: 
  - Créer `PUT /api/user/change-password`
  - Créer un DTO `ChangePasswordDTO` (ancien mot de passe, nouveau mot de passe)
  - Vérifier l'ancien mot de passe avant de mettre à jour
- **Impact**: Sécurité et expérience utilisateur améliorées

---

### 🟡 Améliorations Recommandées (Bonnes pratiques)

#### 14. **Documentation API avec Swagger/OpenAPI**
- **Fichier concerné**: `pom.xml` et nouveau fichier de configuration
- **Solution**: 
  - Ajouter les dépendances `springdoc-openapi-starter-webmvc-ui`
  - Configurer Swagger avec `@OpenAPIDefinition`
  - Documenter les endpoints avec `@Operation`, `@ApiResponse`
- **Impact**: Documentation interactive de l'API, facilité de test

#### 15. **Versioning de l'API**
- **Fichier concerné**: `src/main/java/com/openclassrooms/etudiant/controller/UserController.java`
- **Solution**: 
  - Changer `@RequestMapping` en `@RequestMapping("/api/v1")`
  - Préparer la structure pour les futures versions (v2, v3)
- **Impact**: Évolutivité de l'API sans casser les clients existants

#### 16. **Rate Limiting pour éviter les attaques par force brute**
- **Fichier concerné**: Nouveau fichier à créer
- **Solution**: 
  - Utiliser `Bucket4j` ou `Resilience4j`
  - Limiter le nombre de tentatives de login par IP (ex: 5 tentatives/minute)
  - Retourner `429 Too Many Requests` en cas de dépassement
- **Impact**: Protection contre les attaques par force brute

#### 17. **Gestion des profils Spring (dev, test, prod)**
- **Fichier concerné**: `src/main/resources/application.yml`
- **Solution**: 
  - Créer `application-dev.yml`, `application-prod.yml`
  - Configurer différents paramètres selon l'environnement
  - Utiliser `@Profile` pour les configurations spécifiques
- **Impact**: Configuration adaptée à chaque environnement

#### 18. **Logs structurés (JSON)**
- **Fichier concerné**: `pom.xml` et `application.yml`
- **Solution**: 
  - Ajouter la dépendance `net.logstash.logback:logstash-logback-encoder`
  - Configurer le format JSON dans `logback-spring.xml`
- **Impact**: Meilleure intégration avec les outils de monitoring (ELK, Splunk)

#### 19. **Métriques personnalisées avec Micrometer**
- **Fichier concerné**: Nouveau fichier à créer
- **Solution**: 
  - Ajouter des métriques personnalisées (nombre d'inscriptions, tentatives de login, etc.)
  - Exposer via Actuator `/actuator/metrics`
- **Impact**: Monitoring et observabilité améliorés

#### 20. **Gestion de la traçabilité (Correlation ID)**
- **Fichier concerné**: Nouveau fichier à créer
- **Solution**: 
  - Créer un filtre qui génère un `X-Correlation-ID` pour chaque requête
  - Logger ce ID dans tous les logs
  - Retourner le ID dans les réponses HTTP
- **Impact**: Facilite le débogage et le suivi des requêtes

#### 21. **Health Checks personnalisés**
- **Fichier concerné**: Nouveau fichier à créer
- **Solution**: 
  - Implémenter `HealthIndicator` pour vérifier la connexion DB
  - Créer des health checks spécifiques (disque, mémoire, etc.)
- **Impact**: Meilleur monitoring de l'état de l'application

#### 22. **Gestion du cache**
- **Fichier concerné**: `pom.xml` et nouveau fichier de configuration
- **Solution**: 
  - Ajouter `spring-boot-starter-cache` et `spring-boot-starter-data-redis`
  - Mettre en cache les utilisateurs fréquemment consultés
  - Utiliser `@Cacheable`, `@CacheEvict`
- **Impact**: Performance améliorée, réduction de la charge sur la base de données

#### 23. **Pagination pour les futures listes**
- **Fichier concerné**: Nouveau fichier à créer
- **Solution**: 
  - Utiliser `Pageable` de Spring Data
  - Créer des DTOs de réponse paginés
  - Implémenter dès maintenant pour les futures fonctionnalités (liste des étudiants)
- **Impact**: Performance et scalabilité

#### 24. **Gestion sécurisée des secrets**
- **Fichier concerné**: `src/main/java/com/openclassrooms/etudiant/configuration/AppConfig.java`
- **Problème**: Utilisation de `.env` en dur
- **Solution**: 
  - Utiliser Spring Cloud Config ou HashiCorp Vault
  - Ou au minimum, utiliser des variables d'environnement système
  - Ne jamais commiter les secrets
- **Impact**: Sécurité renforcée

#### 25. **Tests d'intégration complets**
- **Fichier concerné**: `src/test/java/com/openclassrooms/etudiant/`
- **Problème**: Tests incomplets (Testcontainers commentés)
- **Solution**: 
  - Activer Testcontainers pour les tests d'intégration
  - Ajouter des tests pour le login, la validation JWT
  - Ajouter des tests de sécurité (tentatives d'accès non autorisé)
- **Impact**: Qualité et fiabilité du code

#### 26. **Gestion de la réinitialisation de mot de passe**
- **Fichier concerné**: Nouveaux fichiers à créer
- **Solution**: 
  - Créer `POST /api/user/forgot-password` (envoie un email avec un token)
  - Créer `POST /api/user/reset-password` (réinitialise avec le token)
  - Ajouter un champ `resetToken` et `resetTokenExpiry` dans User
  - Intégrer un service d'email (Spring Mail)
- **Impact**: Expérience utilisateur améliorée

#### 27. **Validation d'email pour le login**
- **Fichier concerné**: `src/main/java/com/openclassrooms/etudiant/entities/User.java`
- **Solution**: 
  - Ajouter un champ `email` avec validation `@Email`
  - Permettre la connexion avec email ou login
  - Vérifier l'unicité de l'email
- **Impact**: Flexibilité et conformité aux standards

#### 28. **Gestion des refresh tokens**
- **Fichier concerné**: `src/main/java/com/openclassrooms/etudiant/service/JwtService.java`
- **Solution**: 
  - Générer un access token (courte durée) et un refresh token (longue durée)
  - Créer `POST /api/refresh` pour renouveler l'access token
  - Stocker les refresh tokens en base de données
- **Impact**: Sécurité améliorée (tokens à courte durée) sans déconnexion fréquente

#### 29. **Amélioration de la gestion des erreurs**
- **Fichier concerné**: `src/main/java/com/openclassrooms/etudiant/handler/RestExceptionHandler.java`
- **Solution**: 
  - Ajouter des handlers pour `EntityNotFoundException`, `DataIntegrityViolationException`
  - Créer des codes d'erreur personnalisés
  - Ajouter plus de contexte dans les messages d'erreur (sans exposer de détails sensibles)
- **Impact**: Meilleure expérience développeur et utilisateur

#### 30. **Audit trail (traçabilité des actions)**
- **Fichier concerné**: Nouveau fichier à créer
- **Solution**: 
  - Utiliser `@EntityListeners` et `AuditingEntityListener`
  - Ajouter des champs `createdBy`, `modifiedBy` dans User
  - Logger les actions importantes (inscription, login, modifications)
- **Impact**: Conformité et sécurité (traçabilité)

---

## Priorisation des Améliorations

### Phase 1 - Critique (À faire immédiatement)
1. Correction du bug de validation du mot de passe (#1)
2. Implémentation de la génération JWT (#2)
3. Ajout du filtre JWT (#3)
4. Validation des DTOs (#4)
5. Gestion des exceptions de validation (#5)

### Phase 2 - Important (Court terme)
6. Amélioration de la réponse du login (#6)
7. Gestion des rôles (#7)
8. Validation de la force du mot de passe (#8)
9. Configuration CORS (#9)
10. Endpoint de profil utilisateur (#11)

### Phase 3 - Recommandé (Moyen terme)
14. Documentation API (#14)
15. Versioning (#15)
16. Rate Limiting (#16)
17. Profils Spring (#17)
18. Logs structurés (#18)
25. Tests d'intégration (#25)

### Phase 4 - Améliorations (Long terme)
22. Cache (#22)
26. Réinitialisation de mot de passe (#26)
28. Refresh tokens (#28)
30. Audit trail (#30)
