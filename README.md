# LWF System

![Foundry v11](https://img.shields.io/badge/foundry-v11-green)

This is a system to play the post-apocalyptic anime inspired ttrpg Lone Wolf Fists using Foundry vtt. It has been built starting from the boilerplate system, and is currently not ready for wider use.

## To do
My current goal is to get a fully functional sheet for player characters. From there, I intend to put together sheets for all other actor classes (seriously, theres a lot of them), at which point this system should be at an alpha stage, and able to be used. I have not thought much beyond that, but I have a few initial ideas i'd like to explore

## List of intended changes before alpha
Character sheet
- Implement archetypes - 
  - Make sure there can be only one, and any ones added after the first are ignored - unique item
  - Zero all character sheet data until an archetype is chosen
- Implement clan
  - Make sure there can be only one, and any ones added after the first are ignored - unique item
  - Needs to update the clan-relevant fields
  - Implement a hidden tab where this can be removed and edited if eg a player so offends their clan that they become a ronin.
- Implement Masteries
  - When degree increases, if there aren’t enough masteries provide a button to choose more
  - Implement choose more pop-up sheet. This should: 
    - display all masteries as a checklist.
    - The ones already possessed by the player should be already checked and greyed out
    - The player should be able to choose a number of masteries equal to the difference between the number of masteries they currently have, and 
- Implement weapons
  - Add weapons to a table on the sheet
  - Choose which one is active - make sure only one is active
  - Have that one modify the character’s datamodel
- Implement armor
  - Add armor to a table on the sheet
  - Choose which one/s are active - (? check to make sure the armor combo actually makes sense)
  - Modify the character’s datamodel
- Implement artifacts - ADVANCED, needs items that contain or link to other items
  - Add artifacts to a table on the sheet
  - If weapon, treat like weapon; if armor, treat like armor
  - Add linked techniques to the character sheet
- Put together Icons folder
  - Use game-icons.net to download appropriately coloured Icons
- Set up character sheet
  - All variables displayed
  - See sandbox implementation for aesthetic considerations. NOTE! There were limitations on sandbox, esp around space. A custom sheet has the possibility for a lot more space, which should be used.
  - Non-customisable cells prevented from being customised
