# Règles — enhanced-todos-data

Repo **public** des bases de référence de l'appli Enhanced Todos (repo privé `littleyellowboy/enhanced-todos`). Les règles complètes sont dans le `CLAUDE.md` et `docs/DOCUMENTATION.md` de ce repo privé (§ 4) : les lire avant toute modification.

- Ne jamais modifier `data/` à la main : seulement par les scripts (`sources/`, `scripts/`) et le workflow `bases.yml`.
- Aucune donnée personnelle, aucun secret, aucun jeton dans ce repo (il est public).
- **Revue de sécurité obligatoire** pour tout changement (même checklist que l'appli) : les sources tierces sont lues comme du texte, jamais exécutées (pas de `npm install`, `eval`, `require` sur leur contenu) ; actions épinglées par SHA ; permissions minimales ; validation stricte avant publication.
- Un changement de format des données = changement de l'appli dans le même temps (`www/bases.js`, tests et `tests/fixtures/` du repo privé), avec un nouveau `schema` si l'ancien format ne peut plus être lu.
- Toute modification est notée dans le journal de `docs/DOCUMENTATION.md` du repo privé (avec sa ligne « Revue de sécurité »).
