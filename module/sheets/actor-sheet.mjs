import {
  onManageActiveEffect,
  prepareActiveEffectCategories,
} from '../helpers/effects.mjs';

import { LWFIMBALANCES } from '../helpers/imbalance-config.mjs';
import { LWFSKILLS } from '../helpers/skills.mjs';

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
    if (actorData.type == 'character') {
      this._prepareItems(context);
      this._prepareCharacterData(context);
    }

    // Prepare NPC data and items.
    if (actorData.type == 'npc') {
      this._prepareItems(context);
    }

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
    context.bodyParts = LWFIMBALANCES.bodyParts;
    if (context.clan.length > 0) {
      context.system.deed = context.clan[0].system.deed;
    }
    context.isGM = game.user.isGM;
    context.skills = LWFSKILLS;
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
    const guptKala = [];
    const techniques = {
      "form": [],
      "attack": [],
      "defense": [],
      "balance": [],
      "mudra": [],
    };
    const imbalances = [];
    const archetype = [];
    const clan = [];
    const mastery = [];


    // Iterate through items, allocating to containers
    for (let i of context.items) {
      i.img = i.img || Item.DEFAULT_ICON;
      // Append to gear.
      switch (i.type) {
        case 'item': 
          gear.push(i);
          break;

      // Append to techniques.
        case 'technique':
          if (i.system.techniqueType != undefined) {
            techniques[i.system.techniqueType].push(i);
          }
          break;

        case 'imbalance':
          imbalances.push(i);
          break;

        // Append to gupt kala.
        case 'guptKala':
          guptKala.push(i);
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
        // Check if the player has enough masteries. If they don't, allow new ones to be added on. If they do, delete any subsequent masteries
        case 'masteries':
          if (this.actor.system.masteries.value > mastery.length) {
            mastery.push(i);
          }
          else {
            let target = this.actor.items.get(i._id);
            target.delete();
          }
      }
    }
    // Assign and return
    context.gear = gear;
    context.guptKala = guptKala;
    context.techniques = techniques;
    context.imbalances = imbalances;
    context.clan = clan;
    context.mastery = mastery;
    // Work out the difference between the number of masteries they should have, and the number of masteries they do have.
    // If they have fewer masteries than they should, check the masteries compendium, and see which the player doesn't have
    context.mastery.difference = this.actor.system.masteries.value - mastery.length;
    if(context.mastery.difference > 0){
      // Generate an array of the names of masteries the player currently has
      context.mastery.missing = true;
    }
    return context;
  }

  /* -------------------------------------------- */

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

    // Change imbalance data when the data is altered on the sheet
    html.on('change', '.item-choice', (ev) =>{
      const tr = $(ev.currentTarget).parents('.item').data("itemId");
      const item = this.actor.items.get(tr);
      
      // The following if statement is used to detect if the chosen element is selected or not
      // If there is a better way to do this, lmk
      let update;
      if (ev.currentTarget[1] === undefined)
        update = ev.currentTarget.value;
      else
        update = $(ev.currentTarget).find(":selected").text();
      const target = ev.currentTarget.parentElement.dataset.imbtype;
      item.update({ [`system.${target}`]: update});
    })

    // Choose masteries to add on level up TODO: pass the data back to the original character sheet
    html.on('click', '#newMasteries', async (ev) => {
      const mastery = this.actor.items.filter(({type}) => type == "masteries");
      const names = [];
      for (let i in mastery){
        names.push(mastery[i].name)
      }
      const pack = game.packs.get("lone-wolf-fists.masteries").index;
      const missing = pack.filter(({name}) => !names.includes(name));
      console.log("Stall");
      const masteryHTML = await renderTemplate('systems/lone-wolf-fists/templates/popups/popup-masteries.hbs', missing)
      const choices = await Dialog.wait ({
        title: "Choose your mastery",
        content: masteryHTML,
        buttons:{
          submit: {
            label: "Master",
            callback: (html) => {
              html
            }
          }
        }
      });
      console.log(choices)

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

    // Reduce prana to normal levels
    html.on('click', '#end-combat', async () => {
      let newActive = this.actor.system.chakras.value;
      let reset = this.actor.system.pool.value * newActive;
      let aura = this.actor.system.aura.max;
      this.actor.update({['system.chakras.active']: newActive, ['system.prana.current']: reset, ['system.aura.current']: aura});
    })
    
    // Add a new mastery when it is chosen TODO: delete this once sure its safe, as I don't think anything uses this atm
    html.on('click', '#masterySelect', async (ev) => {
      const mc = Array.from($(ev.currentTarget).siblings(':checked'));
      for (const item of mc) {
        let id = item.id;
        const mastery = await game.packs.get("lone-wolf-fists.masteries").getDocument(id);
        const effect = Array.from(mastery.effects)[0];
        const newMastery = await Item.create ({
          name: mastery.name,
          type: mastery.type,
          img: mastery.img,
        },
        {
          parent: this.actor
        })
        await ActiveEffect.create ({
          name: effect.name,
          changes: effect.changes,
          transfer: effect.transfer,
          duration: effect.duration,
          disabled: false
        },
      {
        parent: newMastery
      })
      }
    }
    )

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
}
