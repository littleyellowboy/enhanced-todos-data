# enhanced-todos-data

Bases publiques utilisées par l'appli « Solveurs Pokémon » (repo privé `enhanced-todos`) : cartes Pokémon « Rare ou mieux », Pokédex et données du jeu Connexions. **Aucune donnée personnelle.**

L'appli télécharge `data/manifest.json`, puis les fichiers listés, vérifie leur empreinte SHA-256 et leur structure, et les garde sur le téléphone (Paramètres > Bases de données).

## Contenu

| Fichier | Contenu |
|---|---|
| `data/cards.json` | Cartes : `[nom, extension, n°, n° Pokédex, PV, types (bits), rareté, stade, illustrateur]` + extensions, séries, raretés, niveaux, badges, noms des types et stades. |
| `data/pokedex.json` | 1 025 espèces : `[nom FR, génération, lignée, type1, type2?]` + noms des types. |
| `data/connexions.json` | Place dans la famille, sortes de cartes (bits), libellés du jeu Connexions. |
| `data/manifest.json` | Date, empreintes SHA-256 et tailles, nombres, dernière extension. |

## Construction

`.github/workflows/bases.yml`, chaque lundi, à la demande (Actions > Bases > Run workflow) ou quand les scripts changent :
1. clone TCGdex (`cards-database`), `pokemon-tcg-data` et les CSV de PokeAPI ;
2. `sources/parse.js`, `build.js`, `poke.js`, `poke2.js` (lecture en texte, aucun code des sources exécuté) ;
3. `scripts/validate.js` : structure, bornes, au moins 9 000 cartes, pas de baisse de plus de 3 % ;
4. `scripts/publish.js` : publie et écrit le manifeste seulement si le contenu a changé.

Sources : [TCGdex](https://github.com/tcgdex/cards-database), [pokemontcg.io](https://github.com/PokemonTCG/pokemon-tcg-data), [PokeAPI](https://github.com/PokeAPI/pokeapi).
