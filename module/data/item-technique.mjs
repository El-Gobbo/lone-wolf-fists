import lwfYuddhakala from "./base-yuddhakala.mjs";

export default class lwfTechnique extends lwfYuddhakala {

  static defineSchema() {
    const { SchemaField, NumberField, StringField, BooleanField, HTMLField } = foundry.data.fields;
    const schema = super.defineSchema();

    //Choose if the technique is attack, defense, versatile, or mudra
    schema.techType = new StringField({initial: "Attack"});

    schema.techLvl = new StringField({initial: "Novice"});

    schema.techReqs = new StringField();

    schema.techCost = new NumberField();

    schema.techFacing = new SchemaField({
      min: new NumberField({min: 0, max: 9}),
      max: new NumberField({min: 0, max: 9}),
      none: new BooleanField({initial: false}),
    });

    schema.techSkill = new StringField({initial: "Power"});

    schema.techRank = new NumberField({min: 0, max: 7});

    schema.techTags = new StringField();

    return schema;
  }

}