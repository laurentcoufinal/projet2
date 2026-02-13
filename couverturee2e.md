# Rapport de couverture des tests e2e

**Projet :** Front-end — Testez et améliorez une application existante  
**Généré à partir des résultats de :** `npm run e2e:coverage`  
**Outil :** Cypress 15.10.0 + @cypress/code-coverage

---

## 1. Résumé de l’exécution

| Élément | Valeur |
|--------|--------|
| **Cypress** | 15.10.0 |
| **Navigateur** | Electron 138 (headless) |
| **Specs exécutés** | 6 |
| **Tests total** | 28 |
| **Réussis** | 28 |
| **Échoués** | 0 |
| **Durée totale** | ~27 s |

---

## 2. Résultats par spec

### delete.cy.ts — Page Supprimer un étudiant (4 tests, ~5 s)

| Test | Statut |
|------|--------|
| should redirect to login when accessing /students/delete/john without authentication | ✓ |
| should display delete confirmation with student info when authenticated | ✓ |
| should redirect to students list after confirming delete | ✓ |
| should navigate from students/delete list to delete page and back | ✓ |

### login.cy.ts — Login page (5 tests, ~4 s)

| Test | Statut |
|------|--------|
| should display login form with login and password fields | ✓ |
| should show validation errors when submitting empty form | ✓ |
| should show error when only login is filled | ✓ |
| should stay on login when API returns 401 | ✓ |
| should redirect to home after successful login when API returns token | ✓ |

### navigation.cy.ts — Navigation (6 tests, ~3 s)

| Test | Statut |
|------|--------|
| should display the home page with navigation | ✓ |
| should display welcome content on home page | ✓ |
| should navigate to login page when clicking Connexion | ✓ |
| should navigate to register page when clicking Inscription | ✓ |
| should redirect to login when accessing students without auth | ✓ |
| should navigate back to home from login | ✓ |

### register.cy.ts — Register page (3 tests, ~2 s)

| Test | Statut |
|------|--------|
| should display registration form with all fields | ✓ |
| should show validation errors when submitting empty form | ✓ |
| should redirect to home after successful registration | ✓ |

### students.cy.ts — Students pages (5 tests, ~4 s)

| Test | Statut |
|------|--------|
| should redirect to login when accessing /students without authentication | ✓ |
| should redirect to login when accessing /students/update without authentication | ✓ |
| should redirect to login when accessing /students/delete without authentication | ✓ |
| should display students list when authenticated | ✓ |
| should display empty message when no students | ✓ |

### update.cy.ts — Page Modifier un étudiant (5 tests, ~6 s)

| Test | Statut |
|------|--------|
| should redirect to login when accessing /students/update/john without authentication | ✓ |
| should display update form when authenticated | ✓ |
| should show validation errors when submitting empty firstname/lastname | ✓ |
| should redirect to students list after successful update | ✓ |
| should navigate from students/update list to update form and back | ✓ |

---

## 3. Objectif de couverture : 80 %

Les tests e2e Cypress doivent atteindre **au moins 80 %** de couverture sur les métriques suivantes (configuré dans `.nycrc.json`) :

- **Statements** : ≥ 80 %
- **Branches** : ≥ 80 %
- **Functions** : ≥ 80 %
- **Lines** : ≥ 80 %

Pour exécuter les e2e avec vérification du seuil : `npm run e2e:coverage:check`. La commande échoue si la couverture est inférieure à 80 %.

En l’absence d’instrumentation du build, la couverture reste à 0 % et `e2e:coverage:check` échouera tant que l’app n’est pas servie avec un build instrumenté (voir MESURE-COUVERTURE-E2E.md).

---

## 4. Couverture de code e2e (collectée par le plugin)

| Métrique   | Valeur actuelle | Remarque |
|-----------|-----------------|----------|
| Statements | 0 % (0/0) | Application non instrumentée |
| Branches   | 0 % (0/0) | Application non instrumentée |
| Functions  | 0 % (0/0) | Application non instrumentée |
| Lines      | 0 % (0/0) | Application non instrumentée |

**Note :** Les pourcentages sont à 0 car l’application n’est pas instrumentée (pas de build avec Istanbul/babel-plugin-istanbul). Le plugin @cypress/code-coverage est bien exécuté ; dès qu’un build instrumenté sera servi, les métriques de couverture de code seront renseignées ici.

---

## 5. Synthèse

- **Tous les specs e2e sont verts** (28/28 tests passés).
- **Parcours couverts par les e2e :** accueil, navigation, connexion, inscription, liste des étudiants, modification et suppression d’un étudiant, garde d’authentification (redirections vers /login).
- **Couverture de code e2e :** non disponible tant que l’app n’est pas servie en build instrumenté.

Pour régénérer ce rapport après une nouvelle exécution :

```bash
npm start
# Dans un autre terminal :
npm run e2e:coverage
```

Puis mettre à jour ce fichier à partir de la sortie console et, le cas échéant, de `coverage/` ou `nyc report --reporter=text-summary`.
