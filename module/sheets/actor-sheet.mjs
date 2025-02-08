import {
  onManageActiveEffect,
  prepareActiveEffectCategories,
} from '../helpers/effects.mjs';

import { LWFIMBALANCES } from '../helpers/imbalance-config.mjs';
import { LWFSKILLS } from '../helpers/skills.mjs';
import { LWFTECHNIQUES } from '../helpers/technique-config.mjs';

import { effortRoll } from '../helpers/dice-roll.mjs';

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheet}
 */
export class lwfActorSheet extends ActorSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['lone-wolf-fists', 'sheet', 'actor'],
      width: 770,
      height: 600,
      tabs: [
        {
          navSelector: '.sheet-tabs',
          contentSelector: '.sheet-body',
          initial: 'core',
        },
      ],
    });
  }

  /** @override */
  get template() {
    return `systems/lone-wolf-fists/templates/actor/actor-${this.actor.type}-sheet.hbs`;
  }

  /* -------------------------------------------- */

  /** @override */
  async getData() {
    // Retrieve the data structure from the base sheet. You can inspect or log
    // the context variable to see the structure, but some key properties for
    // sheets are the actor object, the data object, whether or not it's
    // editable, the items array, and the effects array.
    const context = super.getData();

    // Use a safe clone of the actor data for further operations.
    const actorData = this.document.toPlainObject();

    // Add the actor's data to context.data for easier access, as well as flags.
    context.system = actorData.system;
    context.flags = actorData.flags;

    // Adding a pointer to CONFIG.LWF
    context.config = CONFIG.LWFIMBALANCES;

    // Prepare character data and items.
    if (actorData.type == 'character' || actorData.type == 'monster') {
      this._prepareItems(context);
      this._prepareCharacterData(context);
    }

    if(actorData.type == 'squad') {
      this._prepareMembers(context);
    }

    if(actorData.type === 'platoon') {
      this._preparePlatoon(context);
    }

    // Prepare NPC data and items.
    if (actorData.type == 'npc' || actorData.type == 'squad' || actorData.type == 'platoon') {
      this._prepareItems(context);
    }
    context.isGM = game.user.isGM;

    // Enrich biography info for display
    // Enrichment turns text like `[[/r 1d20]]` into buttons
    context.enrichedBiography = await TextEditor.enrichHTML(
      this.actor.system.biography,
      {
        // Whether to show secret blocks in the finished html
        secrets: this.document.isOwner,
        // Necessary in v11, can be removed in v12
        async: true,
        // Data to fill in for inline rolls
        rollData: this.actor.getRollData(),
        // Relative UUID resolution
        relativeTo: this.actor,
      }
    );


    // Prepare active effects
    context.effects = prepareActiveEffectCategories(
      // A generator that returns all effects stored on the actor
      // as well as any items
      this.actor.allApplicableEffects()
    );

    return context;
  }

  /**
   * Character-specific context modifications
   *
   * @param {object} context The context object to mutate
   */
  _prepareCharacterData(context) {
    // Add data about imbalances to the character sheet
    context.imbalanceSources = LWFIMBALANCES.source;
    context.imbalanceStats = LWFIMBALANCES.stat;
    context.bodyParts = LWFIMBALANCES.bodyPart;
    if (context.clan.length > 0) {
      context.system.deed = context.clan[0].system.deed;
    }
    context.skills = LWFSKILLS;
    context.techType = LWFTECHNIQUES.techType;
    context.techLvl = LWFTECHNIQUES.techLvl;

    let chakraList = Object.keys(context.system.chakras.awakened);
    // Remove either the hell or heaven Chakra
    if(context.system.chakras.hellToggle === true)
      chakraList.splice(1, 1);
    else
      chakraList.splice(0, 1);
    context.chakras = chakraList;

    context.inCombat = context.actor.inCombat;

    return context;
  }

  /**
   * Organize and classify Items for Actor sheets.
   *
   * @param {object} context The context object to mutate
   */
  _prepareItems(context) {
    // Initialize containers.
    const gear = [];
    const weapon = [];
    const armor = [];
    const artifactItems = [];
    let armorValue = 0;
    const guptKala = [];
    const techniques = {
      "attack": [],
      "defense": [],
      "mudra": [],
      "balance": []
    };
    let hasTechniques = false;
    const form = [];
    const imbalances = [];
    const archetype = [];
    const clan = [];
    const skills = [];
    const ability = {
      "Capability": [],
      "Boost": [],
      "Ability": []
    };
    const chargeAttack = [];


    // Iterate through items, allocating to containers
    for (let i of context.items) {
      function pushToTechnique(item, techArray){
        let type = item.system.techType.toLowerCase();
        techArray[type].push(item);
      }
      i.img = i.img || Item.DEFAULT_ICON;
      // Append to gear.
      switch (i.type) {
        case 'item': 
          gear.push(i);
          break;
        
        case 'armor':
          if(i.system.worn === true){
            armorValue += i.system.armorValue;
          }
          armor.push(i);
          break;

        case 'weapon':
          weapon.push(i);
          break;

        case 'artifact':
          if(i.system.type === "Weapon")
            weapon.push(i);
          else if(i.system.type === "Armor")
            armor.push(i);
          else
            artifactItems.push(i);
          if(i.system.hasTechnique) {
            pushToTechnique(i, techniques);
            hasTechniques = true;
          }
          break;

        case 'ability':
          if(i.system.effect.type === 'Charge Attack')
            chargeAttack.push(i);
          else {
            let type = i.system.effect.type;
            ability[type].push(i);
          }
          break;

      // Append to techniques.
        case 'technique':
          pushToTechnique(i, techniques);
          hasTechniques = true;
          break;

        case 'form':
          form.push(i);
          hasTechniques = true;
          break;

        case 'imbalance':
          imbalances.push(i);
          break;

        // Append to gupt kala.
        case 'gupt-kala':
          guptKala.push(i);
          hasTechniques = true;
          break;
        // Check if the player already has an archetype or clan, if they do, delete any new ones added
        case 'archetype':
          if (archetype.length < 1){
            archetype.push(i);
          }
          else {
            let target = this.actor.items.get(i._id);
            target.delete();
          }
          break;
        case 'clan':
          if (clan.length < 1){
            clan.push(i);
          }
          else {
            let target = this.actor.items.get(i._id);
            target.delete();
          }
          break;
        case 'skill':
          skills.push(i);
        
      }
    }
    // Assign and return
    context.gear = gear;
    context.weapon = weapon;
    context.armor = armor;
    context.armorValue = armorValue;
    context.artifacts = artifactItems;
    context.guptKala = guptKala;
    context.techniques = techniques;
    context.hasTechniques = hasTechniques;
    context.imbalances = imbalances;
    context.clan = clan;
    context.form = form;
    context.skill = skills;
    context.ability = ability;
    if(chargeAttack.length > 0)
      context.chargeAttack = chargeAttack;

    if(this.actor.type == 'character')
      this._prepareSkills(context);
    return context;
  }

    /**
   * Further organise skills for Character sheets.
   *
   * @param {object} context The context object to mutate
   */

  /* -------------------------------------------- */

  _prepareSkills(context) {
    let present = [];
    let absent = [];

    // Create a pair of arrays listing the skills the player has mastered (present) and those the player has not (absent)
    // This is to allow for generating the skills list with masteries at the top, and unmastered skills underneath, while retaining the same order of skills
    // TODO: make the datamodel passed to the sheet much simpler
    for(let i in LWFSKILLS) {
      let skill = LWFSKILLS[i].concat(" Mastery");
      let index = context.skill.findIndex((temp) => temp["name"] === skill);
      if(index >= 0) {
        let add = context.skill[index];
        present.push(add);
      }
      else {
        index = context.skill.findIndex((temp) => temp["name"] === LWFSKILLS[i]);
        let add = context.skill[index];
        absent.push(add);
      }
    }
    context.skill.mastered = present;
    context.skill.unmastered = absent; 
    // Work out the difference between the number of masteries they should have, and the number of masteries they do have.
    // If they have fewer masteries than they should, check the masteries compendium, and see which the player doesn't have
    context.skill.difference = this.actor.system.masteries.value - present.length;
    if(context.skill.difference > 0){
      context.skill.missing = true;
    }
    return context;
  }

  /**
 * Organise and find data for individual squad members.
 *
 * @param {object} context The context object to mutate
 */
  async _prepareMembers(context) {
    const members = [];
    for(let m of context.system.namedMembers) {
      const member = await fromUuid(m);
      let duplicate = false;
      for(let i = 0; i < members.length; i++) {
        if(members[i].creature === member.name) {
          members[i].quantity += 1;
          duplicate = true;
          break;
        }
      }
      if(duplicate)
        continue;
      const memberData = {
        "img": member.img,
        "creature": member.name,
        "effort": member.system.power.value,
        "health": member.system.health.value,
        "quantity": 1,
        "editable": false,
        "id": `${m}`
      }
      members.push(memberData);
    }
    for(let m in context.system.members) {
      let current = context.system.members[m];
      current["editable"] = true;
      current["id"] = m;
      members.push(current);
    }
    context.members = members;
    return context;
  }

  _preparePlatoon(context) {
    const platoonLiving = new Array(context.system.membership.current).fill("");
    const dead = context.system.membership.max - context.system.membership.current;
    const platoonDead = new Array(dead).fill("");
    context.living = platoonLiving;
    context.dead = platoonDead;
    return context;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Render the item sheet for viewing/editing prior to the editable check.
    html.on('click', '.item-edit', (ev) => {
      const li = $(ev.currentTarget).parents('.item');
      const item = this.actor.items.get(li.data('itemId'));
      item.sheet.render(true);
    });

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Roll effort when effort clicked
    html.on('click', '#effort', (ev) => {
      const data = { "speaker": { "actor": this.actor.id } };
      const diceNumber = this.actor.system.power.value;
      effortRoll(diceNumber, data)
    });

    // Change imbalance data when the data is altered on the sheet
    html.on('change', '.item-choice', (ev) =>{
      const tr = $(ev.currentTarget).parents('.item').data("itemId");
      const item = this.actor.items.get(tr);
      
      // The following if statement is used to detect if the chosen element is selected or not
      // If there is a better way to do this, lmk
      let update;
      if(ev.currentTarget.type === "checkbox")
        update = $(ev.currentTarget).prop('checked');
      else if (ev.currentTarget.nodeName !== "SELECT")
        update = ev.currentTarget.value;
      else
        update = $(ev.currentTarget).find(":selected").text();
      const target = ev.currentTarget.parentElement.dataset.imbtype;
      
      //Check to see if the target is newly de-selected checkbox. If it is, set  update to false
      if(update === undefined)
        update = false;
      if (target === "name")
        item.update({ [ "name" ]: update});
      else
        item.update({ [`system.${target}`]: update});
    })

    html.on('click', '#rest-button', async () => {
      const restHTML = await renderTemplate('systems/lone-wolf-fists/templates/popups/popup-rest.hbs');
      const restData = await Dialog.wait({
        title: "How long would you like to rest?",
        content: restHTML,
        buttons:{
          submit: {
            label: "Rest",
            callback: (html) => {
              const formElement = html[0].querySelector('form');
              const formData = new FormDataExtended(formElement);
              return formData.object;
            }
          }
        }
      });

      if(restData["full-rest"] === "true"){
        this.actor.update({[ `system.health.current` ]: this.actor.system.health.max })
        return;
      }
      else {
        if(isNaN(parseInt(restData["hours-rested"]))){
          const errorHtml = "<div>Hours rested must be a whole number</div>";
          ui.notifications.error(errorHtml);
          return;
        }
        const rolls = await new Roll(`${restData["hours-rested"]}d10`).evaluate();
        const newHealth = rolls._total + this.actor.system.health.current;
        this.actor.update({[ `system.health.current` ]: newHealth})
      }
    })

    // Choose masteries to add on level up TODO: pass the data back to the original character sheet
    html.on('click', '#newMasteries', async (ev) => {
      const names = [];
      for (let i in LWFSKILLS){
        if(this.actor.system.masteries.types[LWFSKILLS[i]] !== true){
          let newName = LWFSKILLS[i].concat(" Mastery");
          names.push(newName);
        }
      }
      const pack = game.packs.get("lone-wolf-fists.masteries").index;
      const missing = pack.filter(({name}) => names.includes(name));
      const difference = parseInt(ev.currentTarget.dataset.missing);
      const masteries = {"missing": missing, "difference": difference};
      const masteryHTML = await renderTemplate('systems/lone-wolf-fists/templates/popups/popup-masteries.hbs', masteries)
      const choices = await Dialog.wait ({
        title: "Choose your mastery",
        content: masteryHTML,
        buttons:{
          submit: {
            label: "Master",
            callback: (html) => {
              const formElement = html[0].querySelector('form');
              const formData = new FormDataExtended(formElement);
              return formData.object;
            }
          }
        }
      });
      let items = this.actor.items.map(i => i.toObject());
      for(let i in choices){
        if (choices[i] !== null){
          let obj = await game.packs.get('lone-wolf-fists.masteries').getDocument(choices[i]);
          items.push(obj.toObject());
        }
      }
      this.actor.update({ items });
    })

    html.on('click', '.chakra-image',  (ev) => {
      // Find the chakra type
      let chakra = ev.currentTarget.parentElement.dataset.imbtype;

      // Find the current value of the chakra
      const awakened = this.actor.system.chakras.awakened;
      let update = !(awakened[chakra]);
     
      // Update the actor with the inverted value
      this.actor.update({[ `system.chakras.awakened.${chakra}` ]: update})

    })

    // Increase number of active chakras
    html.on('click', '.chakra-increase', async () => {
      let newActive = this.actor.system.chakras.active + 1;
      this.actor.update({['system.chakras.active']: newActive})
    })

    // decrease number of active chakras
    html.on('click', '.chakra-decrease', async () => {
      let newActive = this.actor.system.chakras.active - 1;
      this.actor.update({['system.chakras.active']: newActive});
    })

    // Prana flare when click the prana flare button
    html.on('click', '#prana-flare', async () => {
      let newActive = this.actor.system.chakras.active + 1;
      let increase = this.actor.system.pool.recovery * newActive;
      increase = increase + this.actor.system.prana.current;
      this.actor.update({['system.chakras.active']: newActive, ['system.prana.current']: increase});
    })

    html.on('change', '.techniqueDisplay', (ev) => {
      let update = $(ev.currentTarget)[0].value;
      this.actor.update({[ 'system.techTableFocus' ]: update});
    })

    html.on('click', '#edit-mode', (ev) => {
      const editMode = !this.actor.system.editMode
      this.actor.update({[ 'system.editMode' ]: editMode})
    })

    // Add squad member
    html.on('click', '.member-create', () => {
      // Get a copy of the squad member array
      const members = this.actor.system.members;

      // Add a blank SquadField to the copy
      const newMember = {
        "creature": "",
        "effort": 1,
        "health": 1,
        "quantity": 1
      };
      members.push(newMember);

      // Update the current Squad member array with the new values
      this.actor.update({[ `system.members` ]: members})
    })

    html.on('change', '.member-choice', (ev) => {
      // Get a copy of the squad member array
      const members = this.actor.system.members;
      // Get the new value
      const newValue = ev.currentTarget.value;

      // Get the stat being modified
      const target = ev.currentTarget.parentElement.dataset.imbtype;

      // Get the array index of the member
      const index = ev.currentTarget.parentElement.parentElement.dataset.id;

      // Change the relvant index
      members[index][target] = newValue;
      this.actor.update({[ `system.members` ]: members });
    })

    html.on('click', '.member-delete', (ev) => {
      const location = parseInt(ev.currentTarget.parentElement.parentElement.dataset.id)
      if(isNaN(location)) {
        const newMembers = this.actor.system.namedMembers;
        const index = newMembers.indexOf(ev.currentTarget.parentElement.parentElement.dataset.id.split("-")[1]);
        newMembers.splice(index, 1);
        this.actor.update({[ `system.namedMembers`]: newMembers});
      }
      else {
        const newMembers = this.actor.system.members;
        newMembers.splice(location, 1);
        this.actor.update({[ `system.members`]: newMembers});
      }
    })

    html.on('change', '#membership-set', (ev) => {
      const value = ev.currentTarget.value;
      if (value > 100)
        value = 100;
      else if (value < 0)
        value = 0;
      this.actor.update({[ 'system.membership.max' ]: value, [ 'system.membership.current' ]: value, [ 'system.health.current' ]: value * 10})
    })

    // Add Inventory Item
    html.on('click', '.item-create', this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.on('click', '.item-delete', (ev) => {
      const tr = $(ev.currentTarget).parents('.item');
      const item = this.actor.items.get(tr.data('itemId'));
      item.delete();
      tr.slideUp(200, () => this.render(false));
    });

    // Active Effect management
    html.on('click', '.effect-control', (ev) => {
      const row = ev.currentTarget.closest('li');
      const document =
        row.dataset.parentId === this.actor.id
          ? this.actor
          : this.actor.items.get(row.dataset.parentId);
      onManageActiveEffect(ev, document);
    });

    // Rollable abilities.
    html.on('click', '.rollable', this._onRoll.bind(this));

    // Drag events for macros.
    if (this.actor.isOwner) {
      let handler = (ev) => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains('inventory-header')) return;
        li.setAttribute('draggable', true);
        li.addEventListener('dragstart', handler, false);
      });
    }
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      system: data,
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    delete itemData.system['type'];

    // Finally, create the item!
    return await Item.create(itemData, { parent: this.actor });
  }

  /**
   * Handle clickable rolls.
   * @param {Event} event   The originating click event
   * @private
   */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    // Handle item rolls.
    if (dataset.rollType) {
      if (dataset.rollType == 'item') {
        const itemId = element.closest('.item').dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) return item.roll();
      }
    }

    // Handle rolls that supply the formula directly.
    if (dataset.roll) {
      let label = dataset.label ? `[ability] ${dataset.label}` : '';
      let roll = new Roll(dataset.roll, this.actor.getRollData());
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label,
        rollMode: game.settings.get('core', 'rollMode'),
      });
      return roll;
    }
  }

  async _onDropActor(event, data) {
    if (!this.actor.isOwner || (this.actor.isOwner && this.actor.type !=='squad'))
      return false;
    // Get a copy of the squad member array
    const members = this.actor.system.namedMembers;

    // Get the id of the dropped creature
    const id = data.uuid;
    members.push(id);

    // Update the current Squad member array with the new values
    this.actor.update({[ `system.namedMembers` ]: members})
  }
}
