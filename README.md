# LWF System

![Foundry v12](https://img.shields.io/badge/foundry-v12-green)

This is a system to play the post-apocalyptic anime inspired ttrpg [Lone Wolf Fists](https://www.drivethrurpg.com/en/product/416442/tian-shang-lone-wolf-fists-core-rulebook) using Foundry VTT version 12+. It has been built starting from the [Boilerplate system](https://github.com/asacolips-projects/boilerplate), and is just about ready for wider use. It is my first real coding project, and I learned a lot while doing it - as a result, some design decisions may be suboptimal, and some features are WIP.

## To do
Finish off sheets for all actor and item types. Currently, domains are missing from the actors types, and imbalances and nodes are missing from the items types. Creating imbalances works on character sheets, but they do not have their own sheet.

## List of intended changes before beta
- Create sheets for domains and nodes
- Create sheets for imbalances
- Make clans actually do something
- Create packs for techniques
- Design summary page for player character sheets
- Redesign edit mode to make it more consistent

## Known issues
- The module dice so nice does not work with the dice rolling mechanic - no dice are rolled.
- Effort and health max cannot be increased for player characters - as a workaround for techniques that change these things, create an npc with the relevant stats.

## Licenses
The majority of this system is distributed under the MIT license, but the assets and packs folders are not. See 'assets/LICENSE-ASSETS.md' and 'packs/LICENSE-PACKS.md' for more information