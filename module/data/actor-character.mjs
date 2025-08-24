import { LWFARCH } from "../helpers/archetypes.mjs";
import { LWFCLAN } from "../helpers/clans.mjs";
import lwfActorChakras from "./base-chakras.mjs";

export class lwfCharacter extends lwfActorChakras {
  async _preCreate(data,options,user){
    await super._preCreate(data, options, user);

    const skills = await game.packs.get('lone-wolf-fists.skills').getDocuments();

    const items = this.parent.items.map(i => i.toObject());
  
    for(let i in skills)
      items.push(skills[i].toObject());
  
    this.parent.updateSource({ items });
  }

  static defineSchema() {
    const { SchemaField, NumberField, StringField, BooleanField, HTMLField, ArrayField } = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    // All attributes specific to Lone WOlf fists, affected by levelling up, and not covered by the other categories
    schema.degree = new SchemaField({
      lvl: new NumberField({ ...requiredInteger, initial: 1, min: 1, max: 9 })
    });
    schema.aura = new SchemaField({
      // lvl == aura levels  
      lvl: new NumberField({ ...requiredInteger, initial: 1 }),
      final: new NumberField({integer: true, required: true, initial: 1, min : 0}),
      max: new NumberField({ ...requiredInteger, initial: 10 }),
      value: new NumberField({ ...requiredInteger, initial: 10, min: 0 })
    });
    schema.effortless = new SchemaField({
      lvl: new NumberField({ ...requiredInteger, initial: 0 })
    });
    schema.foci = new SchemaField({
      lvl: new NumberField({ ...requiredInteger, initial: 0 }),
      // Visibility of focus slots is controlled at the character sheet level
      slots: new SchemaField({
        0: new NumberField({ integer: true, nullable: true, min: 0 }),
        1: new NumberField({ integer: true, nullable: true, min: 0 }),
        2: new NumberField({ integer: true, nullable: true, min: 0 }),
        3: new NumberField({ integer: true, nullable: true, min: 0 }),
        4: new NumberField({ integer: true, nullable: true, min: 0 }),
        5: new NumberField({ integer: true, nullable: true, min: 0 }),
        6: new NumberField({ integer: true, nullable: true, min: 0 }),
      })
    });
    // TODO Try to change the capital letters to lower case by using .tolowercase()
    schema.masteries = new SchemaField({
      lvl: new NumberField({ ...requiredInteger, initial: 0 }),
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
    // All datafields relating to kharma
    schema.kharma = new SchemaField({
      value: new NumberField({ ...requiredInteger, initial: 0}),
      lvl: new NumberField({ ...requiredInteger, initial: 200}),
      spent: new NumberField({ ...requiredInteger, initial: 120})
    });

    // All datafields relating to the new optional imbalance system
    schema.optImbalances = new SchemaField({
      enabled: new BooleanField({required: true, initial: false}),
      // As lvl is used to represent fields derived from ../helpers/archetypes, I used level for this.
      level: new NumberField({integer: true, required: true, initial: 0}),
      effortBoost: new NumberField({integer: true, required: true, initial: 0}),
      pranaBoost: new NumberField({integer: true, required: true, initial: 0}),
      auraBoost: new NumberField({integer: true, required: true, initial: 0}),
      injuries: new ArrayField(
        new SchemaField({
          name: new StringField(),
          bodyPart: new StringField({initial: "Internal"}),
          rank: new NumberField({integer: true, required: true, initial: 0, min: 0}),
          agg: new NumberField({integer: true, required: true, initial: 0, min: 0}),
        })
      )
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
    const OPTIONALRULES = game.settings.get("lone-wolf-fists", "optImbalances");
    let degree = this.degree.lvl - 1;
    let archetype = this.archetype;
    // exits if no archetype has yet been set
    if (!(archetype in LWFARCH))
      return;
    // iterates over LWFARCH and assigns the attributes contained within. For more info, see archetypes.mjs
    for (const key in LWFARCH[archetype])
      this[key].lvl = LWFARCH[archetype][key][degree];

    // If too few chakras are active, activate up to the minimum
    if(this.chakras.value < this.chakras.lvl)
      this.chakras.value = this.chakras.lvl;

    
    this.optImbalances.injuries.push({
      name: "test Imbalance",
      bodyPart: "Internal",
      rank: 1,
      agg: 10
    })

    if(OPTIONALRULES){
      this.optImbalances.enabled = true;

      let totalRank = 0;
      for(const injury of this.optImbalances.injuries){
        injury.rank = Math.floor(injury.agg / 10);
        if(injury.bodyPart === "Internal") {
          totalRank += injury.rank;
        }
      }

      this.optImbalances.effortBoost = this.optImbalances.level - totalRank;
      if (this.optImbalances.effortBoost > this.degree.lvl){
        this.optImbalances.effortBoost = this.degree.lvl;
      } 
      this.power.bonus = this.optImbalances.effortBoost;

      this.optImbalances.pranaBoost = (this.optImbalances.level - totalRank) * this.pool.lvl;
      const maxBoost = this.pool.lvl * this.degree.lvl;
      if (this.optImbalances.pranaBoost > maxBoost){
        this.optImbalances.pranaBoost = maxBoost;
      }
      this.prana.gen.bonus = this.optImbalances.pranaBoost;
      if(totalRank > this.aura.lvl) {
        totalRank = this.aura.lvl;
      }
      this.optImbalances.auraBoost = totalRank;
    }
    this.power.final = this.power.lvl + this.power.bonus;
    // calculate max health and aura from health and aura levels respectively
    this.health.max = this.health.lvl * 10;
    if(this.health.max < this.health.value)
      this.health.value = this.health.max;
    this.aura.max = (this.aura.lvl - this.optImbalances.auraBoost) * 10;
    if(this.aura.max < this.aura.value)
      this.aura.value = this.aura.max;
    this.pool.recovery = this.pool.lvl * 2;
    this.prana.gen.outOfCombat = this.pool.lvl * this.chakras.value + this.prana.gen.bonus;
    this.prana.gen.inCombat = this.pool.recovery * this.chakras.value + this.prana.gen.bonus;
    let clan = this.clan;


    if (!(clan in LWFCLAN))
      return;
  }

  getRollData() {
    const data = {};

    // Copy effort to the top level, so it can be used by the standard rolls.
    data.effort = this.power.lvl;
    return data;
  }
}