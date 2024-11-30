import lwfActorBase from "./base-actor.mjs";

export default class lwfCharacter extends lwfActorBase {

  static defineSchema() {
    const { SchemaField, NumberField, StringField, ArrayField, HTMLField } = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    // All attributes specific to Lone WOlf fists, affected by levelling up, and not covered by the other categories
    schema.attributes = new SchemaField({
      degree: new SchemaField({
        value: new NumberField({ ...requiredInteger, initial: 1 })
      }),
      aura: new SchemaField({
        value: new NumberField({ ...requiredInteger, initial: 1 })
      }),
      effortless:new SchemaField({
        value: new NumberField({ ...requiredInteger, initial: 1 })
      }),
      foci: new SchemaField({
        value: new NumberField({ ...requiredInteger, initial: 1 })
      }),
      masteries: new SchemaField({
        value: new NumberField({ ...requiredInteger, initial: 1 })
      }),
    });

    // All the relevant datafields relating to chakras and Prana generation
    schema.chakra = new SchemaField({
      prana: new SchemaField ({
        value: new NumberField({ ...requiredInteger, initial: 0, min: 0, max: 100})
      }),
      active: new SchemaField ({
        value: new NumberField({ ...requiredInteger, initial: 1, min: 1, max: 7}),
        initial: new NumberField({ ...requiredInteger, initial: 1, min: 1, max: 7}),
      }),
      recovery: new NumberField({ ...requiredInteger, initial: 3})
    });

    schema.karma = new SchemaField({
      current: new NumberField({ ...requiredInteger, initial: 0}),
      next: new NumberField({ ...requiredInteger, initial: 200}),
      spent: new NumberField({ ...requiredInteger, initial: 120})
    });

    schema.bio = new SchemaField({
      clan: new StringField(),
      deed: new HTMLField(),
      landmark: new HTMLField(),
      vice: new HTMLField(),
      rep: new HTMLField()
    })

    schema.armor = new NumberField({ ...requiredInteger, initial: 0});
    schema.weapon = new ArrayField(new StringField());
    schema.archetype = new StringField();

    return schema;
  }

  prepareDerivedData() {
    // Loop through ability scores, and add their modifiers to our sheet output.
    /*
    for (const key in this.abilities) {
      // Calculate the modifier using d20 rules.
      this.abilities[key].mod = Math.floor((this.abilities[key].value - 10) / 2);
      // Handle ability label localization.
      this.abilities[key].label = game.i18n.localize(CONFIG.LWF.abilities[key]) ?? key;
    }*/
  }

  getRollData() {
    const data = {};

    // Copy effort to the top level, so it can be used by the standard rolls.
    data.effort = this.power.value;
    return data
  }
}