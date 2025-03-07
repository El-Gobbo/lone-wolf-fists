import lwfYuddhakala from "./base-yuddhakala.mjs";

export default class lwfTechnique extends lwfYuddhakala {
  static defineSchema() {
    const { SchemaField, NumberField, StringField, BooleanField } = foundry.data.fields;
    const schema = super.defineSchema();

    //Choose if the technique is attack, defense, balance, or mudra
    schema.techType = new StringField({initial: "Attack"});

    schema.techLvl = new StringField({initial: "Novice"});

    schema.techReqs = new StringField();

    schema.techCost = new NumberField({integer: true, initial: 3, min: 0, max: 100});

    schema.techFacing = new SchemaField({
      min: new NumberField({integer: true, initial: 0, min: 0, max: 9}),
      max: new NumberField({integer: true, initial: 9, min: 0, max: 9}),
      none: new BooleanField({initial: false}),
    });

    schema.techSkill = new StringField({initial: "-"});

    schema.techRank = new NumberField({integer: true, initial: 1, min: 0, max: 7});

    schema.techTags = new StringField();

    return schema;
  }

}