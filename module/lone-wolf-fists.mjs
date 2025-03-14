// Import document classes.
import { lwfActor } from './documents/actor.mjs';
import { lwfItem } from './documents/item.mjs';
import { lwfCombat } from './documents/combat.mjs';
import { lwfCombatant } from './documents/combatant.mjs';
// Import sheet classes.
import { lwfActorSheet } from './sheets/actor-sheet.mjs';
import { lwfItemSheet } from './sheets/item-sheet.mjs';
// Import helper/utility classes and constants.
import { preloadHandlebarsTemplates } from './helpers/templates.mjs';
// Import DataModel classes
import * as models from './data/_module.mjs';
import { extractDiceNumber, effortRoll } from './helpers/dice-roll.mjs';

/* -------------------------------------------- */
/*  Init Hook                                   */
/* -------------------------------------------- */

Hooks.once('init', function () {
  // Add utility classes to the global game object so that they're more easily
  // accessible in global contexts.
  game.lonewolffists = {
    lwfActor,
    lwfItem,
    rollItemMacro,
  };

  // Add custom constants for configuration.

  /**
   * Set an initiative formula for the system
   * @type {String}
   */
  CONFIG.Combat.initiative = {
    formula: '1d10',
    decimals: 2,
  };

  // Define custom Document and DataModel classes
  CONFIG.Actor.documentClass = lwfActor;

  // Note that you don't need to declare a DataModel
  // for the base actor/item classes - they are included
  // with the Character/NPC as part of super.defineSchema()
  CONFIG.Actor.dataModels = {
    character: models.lwfCharacter,
    npc: models.lwfNpc,
    squad: models.lwfSquad,
    platoon: models.lwfPlatoon,
    titan: models.lwfTitan,
    vehicle: models.lwfVehicle,
    domain: models.lwfDomain
  }

  CONFIG.Combat.documentClass = lwfCombat;
  CONFIG.Combatant.documentClass = lwfCombatant;


  CONFIG.Item.documentClass = lwfItem;
  CONFIG.Item.dataModels = {
    item: models.lwfItem,
    "gupt-kala": models.lwfGuptKala,
    technique: models.lwfTechnique,
    form: models.lwfForm,
    imbalance: models.lwfImbalance,
    archetype: models.lwfArchetype,
    clan: models.lwfClan,
    skill: models.lwfSkill,
    armor: models.lwfArmor,
    weapon: models.lwfWeapon,
    artifact: models.lwfArtifact,
    ability: models.lwfAbility,
    anatomy: models.lwfAnatomy,
    node: models.lwfNode
  }

  // Active Effects are never copied to the Actor,
  // but will still apply to the Actor from within the Item
  // if the transfer property on the Active Effect is true.
  CONFIG.ActiveEffect.legacyTransferral = false;

  // Register sheet application classes
  Actors.unregisterSheet('core', ActorSheet);
  Actors.registerSheet('lone-wolf-fists', lwfActorSheet, {
    makeDefault: true,
    label: 'LWF.SheetLabels.Actor',
  });
  Items.unregisterSheet('core', ItemSheet);
  Items.registerSheet('lone-wolf-fists', lwfItemSheet, {
    makeDefault: true,
    label: 'LWF.SheetLabels.Item',
  });

  // Preload Handlebars templates.
  return preloadHandlebarsTemplates();
});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */

// If you need to add Handlebars helpers, here is a useful example:
Handlebars.registerHelper('comparison', function(var1, var2) {
  return var1 === var2;
});

Handlebars.registerHelper('comparisonOr', function(base, opt1, opt2) {
  return (base === opt1 || base === opt2);
});

Handlebars.registerHelper('comparisonTwo', function(var1, comp1, var2, comp2) {
  return (var1 === comp1 && var2 === comp2);
})

Handlebars.registerHelper('identifyId', function(array, index, id) {
  return (array[index].linkedOnslaught === id);
})

Handlebars.registerHelper('lessThan', function(index, limit) {
  return index < limit;
});

Handlebars.registerHelper('capitalise', function(foo) {
  let output = foo.charAt(0).toUpperCase() + foo.slice(1);
  return output;
});

Handlebars.registerHelper('arrayNotEmpty', function (arr1) {
  return arr1.length !== 0;
});

Handlebars.registerHelper('lookup', function (obj, key) {
  return obj[key];
});

/* -------------------------------------------- */
/*  Dice rolling                                */
/* -------------------------------------------- */

Hooks.on('endCombat', () => {
  console.log('test')
})

// Accept input from chat to trigger roll
Hooks.on('chatMessage', (_, messageText, data) => {
  if (messageText !== undefined && messageText.startsWith(`/effort`)) {
    extractDiceNumber(messageText, data)
    return false
  } else {
    return true
  }
})

// Dashed outline of sets when clicked
Hooks.on('renderChatLog', () => {
  $('#chat-log').on('click', '.dice-set', (ev) => {
    const targetDiv = ev.currentTarget;
    targetDiv.classList.toggle('selected-set')
  })
})


/* -------------------------------------------- */
/*  Ready Hook                                  */
/* -------------------------------------------- */

Hooks.once('ready', function () {
  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on('hotbarDrop', (bar, data, slot) => createItemMacro(data, slot));
});


/* -------------------------------------------- */
/*  Initiative hooks                            */
/* -------------------------------------------- */

// Allow initiative to be edited
// Inspired by "Combat tracker extensions" by Anderware
// Source: https://github.com/Anderware/Combat-Tracker-Extensions
Hooks.on('renderCombatTracker', async (combatTracker, html, combatData) => {
  // Get a list of the elements that display initiative
  const combatants = html.find('.combatant');

  // For each of these elements
  for(const fighterQuery of combatants) {
    // Get the combatant from their userID
    const combatantId = fighterQuery.dataset.combatantId;
    const fighter = await game.combat.combatants.get(combatantId);

    // If initiative hasn't been set, exit
    if(fighter.initiative == null)
      return;

    // Find the initiative display
    const initiativeDiv = fighterQuery.getElementsByClassName('token-initiative')[0];

    // Remove the content of the initiative display
    initiativeDiv.innerHTML = "";

    // Create HTML for a new, editable input display
    let input = document.createElement('input');
    input.type = "number";
    input.setAttribute('min', 0);
    input.setAttribute('value', fighter.initiative);
    input.setAttribute('class', 'initiative-input');
    
    // When the input is changed
    input.addEventListener("change", async (e) => {
      // Find the character's id
      const playerId = e.target.closest('.combatant').dataset.combatantId;

      // Get the character
      const player = game.combat.combatants.get(playerId);

      // Find the new initiative value
      const newInit = e.target.value;

      // Update the stored initiative value to match the input
      player.update({["initiative"]: newInit});
    })
    // Add the html to the initiative display
    initiativeDiv.appendChild(input);
  }
});

// Re-roll initiative each round
// This and the following hook inspired by "Combat utility belt" by errational
// Source: https://github.com/death-save/combat-utility-belt
Hooks.on('preUpdateCombat', (combat, update, options, userID) => {
  // Check that the player in question is a gm - if they aren't, return
  const isGM = game.users.get(userID);
  if(!isGM?.isGM){
    options.rerollInit = false;
    return;
  }
  // Check that this update is creating a new round. If it isn't, return
  // Check that the update is going to a higher-numbered round. If it isn't, return
  if(update.round <= combat.round || !update.round){
    options.rerollInit = false;
    return;
  }
  // If all these tests are passed, create the rerollInit property on options and set it to true
  options.rerollInit = true;
});

Hooks.on('updateCombat', async (combat, updateData, options, userID) => {
  // If rerollInit is absent or false, return
  const rerollInit = options?.rerollInit;
  if(!rerollInit || !game.user.isGM)
    return;
  // Create an iterable object of combatant IDs
  const activeCombatants = combat.combatants.filter(c => c.isDefeated === false)
  const combatantIDs = activeCombatants.map(c => c.id);

  // reroll initiative
  await combat.rollInitiative(combatantIDs);
  await combat.update({['turn']: 0});
});

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {Object} data     The dropped data
 * @param {number} slot     The hotbar slot to use
 * @returns {Promise}
 */
async function createItemMacro(data, slot) {
  // First, determine if this is a valid owned item.
  if (data.type !== 'Item') return;
  if (!data.uuid.includes('Actor.') && !data.uuid.includes('Token.')) {
    return ui.notifications.warn(
      'You can only create macro buttons for owned Items'
    );
  }
  // If it is, retrieve it based on the uuid.
  const item = await Item.fromDropData(data);

  // Create the macro command using the uuid.
  const command = `game.lonewolffists.rollItemMacro("${data.uuid}");`;
  let macro = game.macros.find(
    (m) => m.name === item.name && m.command === command
  );
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: 'script',
      img: item.img,
      command: command,
      flags: { 'lone-wolf-fists.itemMacro': true },
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

/**
 * Create a Macro from an Item drop.
 * Get an existing item macro if one exists, otherwise create a new one.
 * @param {string} itemUuid
 */
function rollItemMacro(itemUuid) {
  // Reconstruct the drop data so that we can load the item.
  const dropData = {
    type: 'Item',
    uuid: itemUuid,
  };
  // Load the item from the uuid.
  Item.fromDropData(dropData).then((item) => {
    // Determine if the item loaded and if it's an owned item.
    if (!item || !item.parent) {
      const itemName = item?.name ?? itemUuid;
      return ui.notifications.warn(
        `Could not find item ${itemName}. You may need to delete and recreate this macro.`
      );
    }

    // Trigger the item roll
    item.roll();
  });
}
