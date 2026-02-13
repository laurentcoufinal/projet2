# Mesure de la couverture des tests e2e

Ce document décrit ce qui est en place pour **mesurer la couverture de code** pendant les tests e2e Cypress, et comment obtenir des pourcentages réels.

---

## 1. Ce qui est déjà en place

- **@cypress/code-coverage** : plugin qui récupère `window.__coverage__` dans le navigateur et génère un rapport (HTML + `.nyc_output`).
- **Scripts npm :**
  - `npm run e2e:coverage` — lance Cypress (l’app doit être déjà servie sur `http://localhost:4200`).
  - `npm run build:e2e-coverage` — build en mode development puis tentative d’instrumentation du dossier `dist/etudiant-frontend/browser` vers `instrumented/` avec `nyc instrument`.
  - `npm run serve:e2e-coverage` — sert le dossier `instrumented/` sur le port 4200.
  - `npm run e2e:coverage:full` — enchaîne : build:e2e-coverage → serve instrumenté → e2e:coverage (via start-server-and-test).
  - `npm run e2e:coverage:check` — comme e2e:coverage:full puis vérifie que la couverture e2e est **≥ 80 %** (lignes, fonctions, branches, statements). Échoue si en dessous.
  - `npm run coverage:e2e:report` — affiche le résumé texte de la couverture après une run (`nyc report --reporter=text-summary`).

**Objectif :** les tests e2e Cypress doivent avoir une couverture de **80 %** minimum (seuils dans `.nycrc.json`).

Sans **instrumentation** du code chargé dans le navigateur, le plugin ne reçoit pas de `__coverage__` et les rapports restent à 0 %.

---

## 2. Limitation actuelle : Angular 19 + esbuild

Le build Angular 19 utilise le builder **application** (esbuild). La commande :

```bash
nyc instrument dist/etudiant-frontend/browser instrumented --complete-copy --delete
```

copie bien les fichiers dans `instrumented/`, mais **nyc n’ajoute pas de compteurs** dans les bundles (fichiers déjà bundlés/minifiés). Du coup, en lançant Cypress contre l’app servie depuis `instrumented/`, la couverture reste à 0 %.

Pour avoir une vraie mesure, il faut que le **code servi au navigateur** soit instrumenté **avant** ou **pendant** le bundling.

---

## 3. Pistes pour obtenir une couverture e2e réelle

### Option A — Plugin esbuild (recommandé si vous customisez le build)

Pour un build basé sur **esbuild**, on peut instrumenter au moment du bundle avec **esbuild-plugin-istanbul** :

- [esbuild-plugin-istanbul](https://www.npmjs.com/package/esbuild-plugin-istanbul)
- Le builder Angular **application** ne permet pas d’injecter des plugins esbuild. Il faudrait soit :
  - un **builder personnalisé** qui appelle esbuild avec ce plugin, soit  
  - un **build séparé** (par ex. script Node qui bundle l’app avec esbuild + istanbul) et servir ce build pour les e2e.

### Option B — Cypress UI Coverage (sans instrumentation code)

Cypress propose une **UI Coverage** qui mesure quels **éléments d’interface** sont touchés par les tests (pas les lignes de code) :

- [Cypress UI Coverage](https://docs.cypress.io/ui-coverage/get-started/introduction)  
Aucune instrumentation du code n’est nécessaire.

### Option C — Ancien builder webpack (Angular &lt; 17)

Avec l’ancien builder **browser** (webpack), des solutions comme **ngx-build-plus** + **babel-plugin-istanbul** permettaient d’instrumenter. Avec Angular 19 et le builder **application**, cette approche n’est plus applicable telle quelle.

---

## 4. Utilisation des scripts actuels

Même sans instrumentation efficace pour l’instant, vous pouvez déjà :

1. **Lancer les e2e en partant du build “instrumenté” (pour tester la chaîne) :**
   ```bash
   npm run e2e:coverage:full
   ```
   Cela exécute : build dev → nyc instrument → serve `instrumented/` sur 4200 → Cypress. Les tests s’exécutent ; seuls les pourcentages de couverture restent à 0 % tant que le code servi n’est pas vraiment instrumenté.

2. **Si plus tard vous servez un build réellement instrumenté** (ex. via esbuild-plugin-istanbul) :
   - Mettez le résultat dans le dossier **`instrumented/`** (ou adaptez `serve:e2e-coverage` pour servir le dossier où se trouve ce build).
   - Lancez `npm run serve:e2e-coverage` puis `npm run e2e:coverage`, ou gardez `npm run e2e:coverage:full` en pointant vers ce build.
   - Les rapports dans `coverage/` et `nyc report` commenceront à afficher une couverture non nulle.

3. **Consulter un rapport après une run :**
   ```bash
   npm run coverage:e2e:report
   ```

---

## 5. Résumé

- **Chaîne de mesure** : build → (instrumentation) → serve → Cypress → rapport (nyc + @cypress/code-coverage) est en place.
- **Blocage actuel** : le bundle Angular 19 (esbuild) n’est pas instrumenté par `nyc instrument` ; il faut une instrumentation au moment du build (ex. esbuild-plugin-istanbul ou équivalent).
- **Prochaine étape** : soit intégrer un build e2e instrumenté (esbuild + plugin Istanbul), soit utiliser Cypress UI Coverage pour une “couverture” basée sur l’UI.
