# Résultats des tests

**Généré le :** 13/02/2026 17:01:20

---

## 1. Tests unitaires (Jest)

| Métrique   | Couvert | Total | Pourcentage |
|------------|---------|-------|-------------|
| Statements | 276 | 288 | 95.83 % |
| Branches   | 75 | 114 | 65.78 % |
| Functions  | 48 | 52 | 92.3 % |
| Lines      | 248 | 259 | 95.75 % |

**Seuils attendus (jest.config.js) :** statements ≥ 80 %, lines ≥ 80 %, functions ≥ 80 %, branches ≥ 55 %.

---

## 2. Tests e2e (Cypress)

Voir le fichier **`couverturee2e.md`** pour le détail des scénarios e2e et le résumé de la dernière exécution.

Pour régénérer les résultats e2e :
```bash
npm start
# Dans un autre terminal :
npm run e2e:coverage
```

---

## 3. Régénérer ce rapport

```bash
npm run test:results
```
