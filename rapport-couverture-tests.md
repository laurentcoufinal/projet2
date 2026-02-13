# Rapport de couverture des tests

**Projet :** Front-end — Testez et améliorez une application existante  
**Date :** 13 février 2026  
**Outils :** Jest (tests unitaires), Cypress + @cypress/code-coverage (tests e2e)

---

## 1. Objectif

Contrôler que la couverture des tests unitaires atteint au moins **80 %** pour les métriques principales (statements, lines, functions), avec un seuil minimal sur les branches.

---

## 2. Configuration (jest.config.js)

| Option | Valeur |
|--------|--------|
| **Preset** | jest-preset-angular |
| **Racines** | `src/` |
| **Fichiers de test** | `**/+(*.)+(spec).+(ts\|js)` |
| **Couverture collectée** | Oui |
| **Rapports** | HTML (`coverage/`), résumé texte (console) |

### Seuils de couverture (coverageThreshold)

| Métrique   | Seuil | Objectif |
|-----------|-------|----------|
| Statements | 80 % | ✅ |
| Lines      | 80 % | ✅ |
| Functions  | 80 % | ✅ |
| Branches   | 55 % | Seuil minimal (amélioration possible) |

### Fichiers exclus de la couverture

- `main.ts`
- `app.config.ts`
- `app.routes.ts`
- Fichiers `*.module.ts`
- Dossier `models/`

---

## 3. Fichiers de test (11 specs)

| Fichier | Rôle |
|---------|------|
| `app.component.spec.ts` | Composant racine |
| `auth.guard.spec.ts` | Garde d’authentification |
| `core/interceptors/auth.interceptor.spec.ts` | Intercepteur HTTP auth |
| `core/service/auth.service.spec.ts` | Service d’authentification |
| `core/service/user.service.spec.ts` | Service utilisateur / API |
| `pages/home/home.component.spec.ts` | Page d’accueil |
| `pages/login/login.component.spec.ts` | Page de connexion |
| `pages/register/register.component.spec.ts` | Page d’inscription |
| `pages/students/students.component.spec.ts` | Liste des étudiants |
| `pages/delete/delete.component.spec.ts` | Suppression d’un étudiant |
| `pages/update/update.component.spec.ts` | Mise à jour d’un étudiant |

---

## 4. Contrôle de couverture

La couverture est **contrôlée** par les seuils définis dans `jest.config.js` (`coverageThreshold`). Si une métrique est sous le seuil, la commande échoue (code de sortie ≠ 0).

**Commande dédiée au contrôle :**

```bash
npm run coverage:check
```

- Exécute les tests unitaires avec collecte de couverture.
- **Échoue** si les seuils (statements, lines, functions, branches) ne sont pas atteints.
- Utilisable en CI pour bloquer une merge en cas de baisse de couverture.
- Option `--ci` : mode non interactif, une seule exécution.

## 5. Commandes

```bash
# Lancer les tests
npm test

# Lancer les tests avec rapport de couverture
npm run test:coverage
# ou
npm test -- --coverage

# Contrôler la couverture (échoue si sous les seuils)
npm run coverage:check
```

Le rapport HTML détaillé est généré dans **`coverage/index.html`** (à ouvrir dans un navigateur).

---

## 6. Résultats typiques (dernière exécution)

- **Suites :** 11 passées  
- **Tests :** 59 passés  
- **Statements :** ~96 %  
- **Lines :** ~96 %  
- **Functions :** ~92 %  
- **Branches :** ~66 %  

Les seuils configurés (80 % pour statements, lines, functions ; 55 % pour branches) sont respectés. En cas de baisse sous ces seuils, la commande `npm run test:coverage` fera échouer les tests.

---

## 7. Recommandations

1. **Conserver le seuil à 80 %** pour statements, lines et functions.
2. **Augmenter progressivement le seuil des branches** (par ex. 60 % puis 80 %) en ajoutant des cas de test sur les chemins conditionnels.
3. **Consulter régulièrement** `coverage/index.html` pour repérer les fichiers ou blocs peu couverts.
4. **Exécuter `npm run test:coverage`** en CI pour bloquer les merges si la couverture descend sous les seuils.

---

## 8. Couverture des tests e2e (Cypress)

### Contrôle de la couverture e2e

La couverture du code **exécuté pendant les tests e2e** est collectée via le plugin **@cypress/code-coverage**. Elle permet de voir quelles parties de l’application sont exercées par les scénarios Cypress.

**Commandes :**

```bash
# 1. Démarrer l’application (dans un premier terminal)
npm start

# 2. Lancer les tests e2e avec collecte de couverture (dans un second terminal)
npm run e2e:coverage
```

À la fin des tests, le plugin génère :
- un rapport dans **`coverage/`** (ou **`coverage-e2e/`** selon la config nyc) ;
- les données brutes dans **`.nyc_output/`**.

Pour afficher un résumé texte après une exécution :

```bash
npm run coverage:e2e:report
```

### Condition pour avoir une couverture e2e non nulle

La couverture e2e n’est **pas nulle** seulement si l’application est **instrumentée** au moment où Cypress la charge (ex. build avec `babel-plugin-istanbul` ou équivalent, ou serveur qui sert du code instrumenté). Sans instrumentation, le rapport e2e restera vide ou à 0 %.

Pour instrumenter une app Angular, il faut en général :
- soit utiliser **ngx-build-plus** (ou un builder personnalisé) pour injecter l’instrumentation au build ;
- soit servir un build pré-instrumenté (ex. avec `nyc instrument`).

Une fois l’instrumentation en place, vous pouvez ajouter des seuils dans **`.nycrc.json`** (`check-coverage: true` et champs `lines`, `functions`, etc.) pour faire échouer le build si la couverture e2e descend sous un pourcentage donné.

**Scripts pour servir un build instrumenté et lancer les e2e :**

- `npm run build:e2e-coverage` — build development + `nyc instrument` vers le dossier `instrumented/`
- `npm run serve:e2e-coverage` — sert `instrumented/` sur le port 4200
- `npm run e2e:coverage:full` — enchaîne build instrumenté, serve, puis Cypress (tout-en-un)

**Limitation :** avec Angular 19 (builder esbuild), `nyc instrument` ne modifie pas les bundles ; la couverture reste à 0 % tant qu’un build réellement instrumenté (ex. avec **esbuild-plugin-istanbul**) n’est pas utilisé. Voir **MESURE-COUVERTURE-E2E.md** pour le détail et les options.
