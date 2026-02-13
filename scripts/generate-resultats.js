#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const coveragePath = path.join(__dirname, '..', 'coverage', 'coverage-summary.json');
const jestResultsPath = path.join(__dirname, '..', 'jest-results.json');
const outputPath = path.join(__dirname, '..', 'resultats-tests.md');

let numTests = '';
let numSuites = '';
try {
  const jestResults = JSON.parse(fs.readFileSync(jestResultsPath, 'utf8'));
  numTests = jestResults.numTotalTests || '';
  numSuites = jestResults.numTotalTestSuites || '';
} catch (_) {}

let markdown = `# Résultats des tests

**Généré le :** ${new Date().toLocaleString('fr-FR')}

---

## 1. Tests unitaires (Jest)

${numSuites ? `**Suites :** ${numSuites} | **Tests :** ${numTests}\n\n` : ''}
`;

try {
  const summary = JSON.parse(fs.readFileSync(coveragePath, 'utf8'));
  const total = summary.total;
  if (total) {
    markdown += `| Métrique   | Couvert | Total | Pourcentage |
|------------|---------|-------|-------------|
| Statements | ${total.statements.covered} | ${total.statements.total} | ${total.statements.pct} % |
| Branches   | ${total.branches.covered} | ${total.branches.total} | ${total.branches.pct} % |
| Functions  | ${total.functions.covered} | ${total.functions.total} | ${total.functions.pct} % |
| Lines      | ${total.lines.covered} | ${total.lines.total} | ${total.lines.pct} % |

**Seuils attendus (jest.config.js) :** statements ≥ 80 %, lines ≥ 80 %, functions ≥ 80 %, branches ≥ 55 %.
`;
  } else {
    markdown += `*Aucune donnée de couverture (relancer \`npm run coverage:check\`).*\n`;
  }
} catch (e) {
  markdown += `*Fichier de couverture non trouvé. Exécuter \`npm run coverage:check\` puis \`npm run test:results\`.*\n`;
}

markdown += `
---

## 2. Tests e2e (Cypress)

Voir le fichier **\`couverturee2e.md\`** pour le détail des scénarios e2e et le résumé de la dernière exécution.

Pour régénérer les résultats e2e :
\`\`\`bash
npm start
# Dans un autre terminal :
npm run e2e:coverage
\`\`\`

---

## 3. Régénérer ce rapport

\`\`\`bash
npm run test:results
\`\`\`
`;

fs.writeFileSync(outputPath, markdown, 'utf8');
console.log('Rapport écrit dans resultats-tests.md');
