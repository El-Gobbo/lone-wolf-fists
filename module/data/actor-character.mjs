import lwfActorBase from "./base-actor.mjs";
import { LWFARCH } from "./archetypes.mjs";

export default class lwfCharacter extends lwfActorBase {

  static defineSchema() {
    const { SchemaField, NumberField, StringField, ArrayField, HTMLField } = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    // All attributes specific to Lone WOlf fists, affected by levelling up, and not covered by the other categories
    schema.degree = new SchemaField({
        value: new NumberField({ ...requiredInteger, initial: 1 })
      });
    schema.aura = new SchemaField({
        value: new NumberField({ ...requiredInteger, initial: 1}),
        max: new NumberField({ ...requiredInteger, initial: 10}),
        current: new NumberField({ ...requiredInteger, initial: 10})
      });
    schema.effortless = new SchemaField({
        value: new NumberField({ ...requiredInteger, initial: 1 })
      });
    schema.foci = new SchemaField({
      value: new NumberField({ ...requiredInteger, initial: 1 })
    });
    schema.masteries = new SchemaField({
      value: new NumberField({ ...requiredInteger, initial: 1 })
    });

    // All the relevant datafields relating to chakras and Prana generation
    schema.prana = new SchemaField({
      value: new NumberField({ ...requiredInteger, initial: 0, min: 0, max: 100}),
    });
    schema.pool = new SchemaField({
      value: new NumberField({ ...requiredInteger, initial: 0, min: 0 })
    })
    schema.chakras = new SchemaField ({
        active: new NumberField({ ...requiredInteger, initial: 1, min: 1, max: 7}),
        value: new NumberField({ ...requiredInteger, initial: 1, min: 1, max: 7}),
      }),
    // All datafields relating to karma
    schema.karma = new SchemaField({
      current: new NumberField({ ...requiredInteger, initial: 0}),
      value: new NumberField({ ...requiredInteger, initial: 200}),
      spent: new NumberField({ ...requiredInteger, initial: 120})
    });
    // All datafields relating to background or roleplay informmation about the character
    schema.archetype = new StringField({initial: "none"});
    schema.clan = new StringField();
    schema.deed = new HTMLField();
    schema.landmark = new HTMLField();
    schema.vice = new HTMLField();
    schema.rep = new HTMLField();

    schema.armor = new NumberField({ ...requiredInteger, initial: 0});
    schema.weapon = new ArrayField(new StringField());

    return schema;
  }

  prepareDerivedData() {
    // Initialise all derived data from the LWFARCH const
    let degree = this.degree;
    let archetype = this.archetype;
    // exits if no archetype has yet been set
    if (!(archetype in LWFARCH))
      return;
    // iterates over LWFARCH and assigns the attributes contained within. For more info, see archetypes.mjs
    for (const key in LWFARCH[archetype])
      this[key].value = LWFARCH[archetype][degree][key];

  }

  getRollData() {
    const data = {};

    // Copy effort to the top level, so it can be used by the standard rolls.
    data.effort = this.power.value;
    return data
  }
}