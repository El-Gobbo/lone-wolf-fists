import {
  onManageActiveEffect,
  prepareActiveEffectCategories,
} from '../helpers/effects.mjs';
import { sanitiseAndBreak } from '../helpers/strings.mjs';
import { LWFTECHNIQUES } from '../helpers/technique-config.mjs';
import { LWFSKILLS } from '../helpers/skills.mjs';
import { LWFWEAPONTAGS } from '../helpers/weapon-tags.mjs';
import { LWFARTIFACTS } from '../helpers/artifact-config.mjs';
import { LWFABILITIES } from '../helpers/abilities.mjs';
import { LWFNODES } from '../helpers/nodes.mjs';

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class lwfItemSheet extends ItemSheet {
  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ['lone-wolf-fists', 'sheet', 'item'],
      width: 400,
      height: 600,
      tabs: [
        {
          navSelector: '.sheet-tabs',
          contentSelector: '.sheet-body',
          initial: 'description',
        },
      ],
    });
  }

  /** @override */
  get template() {
    const path = 'systems/lone-wolf-fists/templates/item';
    // Return a single sheet for all item types.
    // return `${path}/item-sheet.hbs`;

    // Alternatively, you could use the following return statement to do a
    // unique item sheet by type, like `weapon-sheet.hbs`.
    return `${path}/item-${this.item.type}-sheet.hbs`;
  }

  /* -------------------------------------------- */

  /** @override */
  async getData() {
    // Retrieve base data structure.
    const context = super.getData();

    // Use a safe clone of the item data for further operations.
    const itemData = this.document.toPlainObject();

    // Enrich description info for display
    // Enrichment turns text like `[[/r 1d20]]` into buttons
    context.enrichedDescription = await TextEditor.enrichHTML(
      this.item.system.description,
      {
        // Whether to show secret blocks in the finished html
        secrets: this.document.isOwner,
        // Necessary in v11, can be removed in v12
        async: true,
        // Data to fill in for inline rolls
        rollData: this.item.getRollData(),
        // Relative UUID resolution
        relativeTo: this.item,
      }
    );

    // Add the item's data to context.data for easier access, as well as flags.
    context.system = itemData.system;
    context.flags = itemData.flags;

    // Adding a pointer to CONFIG.LWF
    context.config = CONFIG.LWF;

    // Prepare active effects for easier access
    context.effects = prepareActiveEffectCategories(this.item.effects);

    if (itemData.type === "technique" || itemData.type === "artifact"){
      context.techType = LWFTECHNIQUES.techType;
      context.techLvl = LWFTECHNIQUES.techLvl;
      context.skills = LWFSKILLS;
      context.techEffect = sanitiseAndBreak(context.system.techEffect);
    }

    if(itemData.type === "weapon" || itemData.type === "artifact"){
      context.tagsCore = LWFWEAPONTAGS.core;
      context.tagsExtra = LWFWEAPONTAGS.extra;
    }

    if(itemData.type === "artifact"){
      context.artifactType = LWFARTIFACTS.type;
      context.artifactTier = LWFARTIFACTS.tier;
      context.artifactTags = LWFARTIFACTS.tag;
      context.artifactDescription = sanitiseAndBreak(context.system.artifactDescription);
    }

    if(itemData.type === "ability") {
      context.abilityType = LWFABILITIES.types;
    }

    if(itemData.type === 'anatomy') {
      let onslaughtName;
      const onslaughts = this.item.parent?.items?.filter(i => (i.type === 'onslaught'));
      const linkedOnslaught = onslaughts?.filter(o => (o._id === context.system.linkedOnslaught));
      if(linkedOnslaught === undefined)
        onslaughtName = "None";
      else {
        onslaughtName = linkedOnslaught.name;
      }
      context.onslaughtName = onslaughtName;
      context.onslaughts = onslaughts;
    }

    if(itemData.type === 'node') {
      context.nodeType = LWFNODES.nodeType;
      context.richness = LWFNODES.richness;
      context.developmentLevel = LWFNODES.developmentLevel;
      context.developmentProduct = LWFNODES.developmentProduct;
    }
    context.isGM = game.user.isGM;
    context.duration = LWFABILITIES.durations;

    return context;
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Roll handlers, click handlers, etc. would go here.

    // Active Effect management
    html.on('click', '.effect-control', (ev) =>
      onManageActiveEffect(ev, this.item)
    );

    // Change imbalance data when the data is altered on the sheet
    html.on('change', '.item-choice', async (ev) =>{      
      const tr = $(ev.currentTarget).parents('.sheet')[0].id;
      const id = tr.substring(tr.indexOf('-') + 1).replaceAll('-', '.');
      
      const item = fromUuidSync(id);
      
      // The following if statement is used to detect if the chosen element is selected or not
      // If there is a better way to do this, lmk
      let update;
      if(ev.currentTarget.type === "checkbox")
        update = $(ev.currentTarget).prop('checked');
      else if (ev.currentTarget.nodeName !== "SELECT")
        update = ev.currentTarget.value;
      else
        update = $(ev.currentTarget).find(":selected")[0].value;
      const target = ev.currentTarget.dataset.techstat;
      await item.update({ [`system.${target}`]: update});
    });

    html.on('click', '#edit-mode', (ev) => {
      const editMode = !this.item.system.editMode
      this.item.update({[ 'system.editMode' ]: editMode})
    })

    // Leaving this here as an example of creating an active effect
    /*html.on('change', '#armorValue', async (ev) => {
      
      let toDelete = Array.from(this.item.effects);
      // Check to see if the effect is currently disabed, and make the new effect disabled if it is
      // This assumes that there is only one effect
      let isDisabled = toDelete[0]?.disabled;
      if(isDisabled === undefined)
        isDisabled = true;

      for(let i in toDelete){
        this.item.deleteEmbeddedDocuments('ActiveEffect', [`${toDelete[i]._id}`])
      }

      this.item.createEmbeddedDocuments('ActiveEffect', [{
        name: "setArmor",
        origin: this.item.uuid,
        disabled: false,
        changes: [{
          key: "system.armor",
          mode: 2,
          value: ev.currentTarget.value,
          }]
        }]
      );
    })*/
  }
}
