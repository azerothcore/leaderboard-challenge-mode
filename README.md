# Challenge Modes Leaderboard

A leaderboard for the AzerothCore [challenge modes](https://github.com/r-o-b-o-t-o/challenge-modes)
module.

## Challenges

Hardcore (1), Ironman (2) and Bloodthirsty (4) can be combined, and the module stores the
combination as a bitmask. Every combination is ranked separately, matching the in-game Hall of Fame:
in game a challenger may only party with characters running the exact same combination, so a
Hardcore + Ironman run does not compete against a plain Hardcore run.

Characters are ranked by completion first, then by the level reached, then by the lowest played
time. Played time is the module's `/played` counter at the character's last level-up, which for a
completed run is the time it took to reach the level cap. It is the only timing the module records.

Any column header sorts the whole bracket, not just the page on screen. The Date column holds the
date the run ended: the completion date for finishers, the death date for the fallen. The module
stores a death date but no completion date, so acore-api reads the latter from the date of the
character's level milestone achievement — the module marks a run completed on the level-up that
reaches the cap, so the two coincide. Characters that were hard-deleted after finishing have no
achievements left and show no date.

## Requirements

The app reads from [acore-api](https://github.com/azerothcore/acore-api), which needs the
`/characters/challenge_modes/*` endpoints and an `ELUNA_DATABASE_NAME` pointing at the schema
holding the challenge-modes tables.

## Setup

```bash
npm install
cp config.ts.dist config.ts
```

Set `API_URL` in `config.ts` to your acore-api instance, then:

```bash
npm start
```

## Build

```bash
npm run build
```

The app uses hash routing, so `dist/leaderboard-challenge-mode/browser` can be served from any
subdirectory without server rewrites.

## Credits

Challenge modes module by [Roboto](https://github.com/r-o-b-o-t-o).

AzerothCore: [repository](https://github.com/azerothcore) - [website](http://azerothcore.org/) -
[discord](https://discord.gg/PaqQRkd)
