import lwfWeaponUser from "./base-weaponuser.mjs";
import { LWFARCH } from "../helpers/archetypes.mjs";
import { LWFCLAN } from "../helpers/clans.mjs";

export default class lwfCharacter extends lwfWeaponUser {
  async _preCreate(data,options,user){
    await super._preCreate(data, options, user);

    const skills = await game.packs.get('lone-wolf-fists.skills').getDocuments();

    const items = this.parent.items.map(i => i.toObject());
  
    for(let i in skills)
      items.push(skills[i].toObject());
  
    this.parent.updateSource({ items });


  }
  static defineSchema() {
    const { SchemaField, NumberField, StringField, ArrayField, BooleanField, HTMLField } = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    // All attributes specific to Lone WOlf fists, affected by levelling up, and not covered by the other categories
    schema.degree = new SchemaField({
      value: new NumberField({ ...requiredInteger, initial: 1, min: 1, max: 9 })
    });
    schema.aura = new SchemaField({
      // value == aura levels  
      value: new NumberField({ ...requiredInteger, initial: 1 }),
      max: new NumberField({ ...requiredInteger, initial: 10 }),
      current: new NumberField({ ...requiredInteger, initial: 10, min: 0 })
    });
    schema.effortless = new SchemaField({
      value: new NumberField({ ...requiredInteger, initial: 0 })
    });
    schema.foci = new SchemaField({
      value: new NumberField({ ...requiredInteger, initial: 0 }),
      // Visibility of focus slots is controlled at the character sheet level
      slots: new SchemaField({
        0: new NumberField({ integer: true, initial: 0 }),
        1: new NumberField({ integer: true, initial: 0 }),
        2: new NumberField({ integer: true, initial: 0 }),
        3: new NumberField({ integer: true, initial: 0 }),
        4: new NumberField({ integer: true, initial: 0 }),
        5: new NumberField({ integer: true, initial: 0 }),
        6: new NumberField({ integer: true, initial: 0 }),
      })
    });
    // TODO Try to change the capital letters to lower case by using .tolowercase()
    schema.masteries = new SchemaField({
      value: new NumberField({ ...requiredInteger, initial: 0 }),
      types: new SchemaField({
        Power: new BooleanField({initial: false}),
        Agility: new BooleanField({initial: false}),
        Endurance: new BooleanField({initial: false}),
        Intellect: new BooleanField({initial: false}),
        Senses: new BooleanField({initial: false}),
        Heart: new BooleanField({initial: false}),
        Spirit: new BooleanField({initial: false}),
      })
    });

    // All the relevant datafields relating to chakras and Prana generation
    schema.prana = new SchemaField({
      current: new NumberField({ ...requiredInteger, initial: 0, min: 0, max: 100 }),
      gen: new SchemaField({
        slumbering: new NumberField({...requiredInteger, initial: 0}),
        flare: new NumberField({...requiredInteger, initial: 0 }),
      }),
    });

    schema.pool = new SchemaField({
      value: new NumberField({ ...requiredInteger, initial: 0, min: 0 }),
      recovery: new NumberField({ ...requiredInteger, initial: 0, min: 0 })
    });
    schema.chakras = new SchemaField ({
     //value == initial chakras
      value: new NumberField({ ...requiredInteger, initial: 1, min: 1, max: 7 }),
      active: new NumberField({ ...requiredInteger, initial: 1, min: 1, max: 7 }),
      hellToggle: new BooleanField({initial: false}),
      awakened: new SchemaField({
        Heaven: new BooleanField({initial: false}),
        Hell: new BooleanField({initial: false}),
        Metal: new BooleanField({initial: false}),
        Wood: new BooleanField({initial: false}),
        Air: new BooleanField({initial: false}),
        Fire: new BooleanField({initial: false}),
        Water: new BooleanField({initial: false}),
        Earth: new BooleanField({initial: false}),
      })
    });
    // All datafields relating to karma
    schema.karma = new SchemaField({
      current: new NumberField({ ...requiredInteger, initial: 0}),
      value: new NumberField({ ...requiredInteger, initial: 200}),
      spent: new NumberField({ ...requiredInteger, initial: 120})
    });
    // All datafields relating to background or roleplay informmation about the character
    schema.archetype = new StringField({initial: ""});
    schema.clan = new StringField({initial: ""});
    schema.deed = new HTMLField();
    schema.landmark = new HTMLField();
    schema.vice = new HTMLField();
    schema.rep = new HTMLField();

    return schema;
  }

  prepareDerivedData() {
    // Initialise all derived data from the LWFARCH const
    let degree = this.degree.value - 1;
    let archetype = this.archetype;
    // exits if no archetype has yet been set
    if (!(archetype in LWFARCH))
      return;
    
    // iterates over LWFARCH and assigns the attributes contained within. For more info, see archetypes.mjs
    for (const key in LWFARCH[archetype])
      this[key].value   = LWFARCH[archetype][key][degree];
    
    // if too few chakras are active, bring them up to the minimum
    if (this.chakras.active < this.chakras.value)
      this.chakras.active = this.chakras.value;
    
    // calculate max health and aura from health and aura levels respectively
    this.health.max     = this.health.value * 10;
    if(this.health.max < this.health.current)
      this.health.current = this.health.max;
    this.aura.max       = this.aura.value * 10;
    if(this.aura.max < this.aura.current)
      this.aura.current = this.aura.max;
    this.pool.recovery  = this.pool.value * 2;
    this.prana.gen.slumbering      = this.pool.value * this.chakras.active;
    this.prana.gen.flare = this.pool.recovery * this.chakras.active;

    let clan = this.clan;
    if (!(clan in LWFCLAN))
      return;
  }

  getRollData() {
    const data = {};

    // Copy effort to the top level, so it can be used by the standard rolls.
    data.effort = this.power.value;
    return data;
  }
}