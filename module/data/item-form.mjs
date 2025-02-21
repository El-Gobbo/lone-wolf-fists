import lwfYuddhakala from "./base-yuddhakala.mjs";

export default class lwfForm extends lwfYuddhakala {

  static defineSchema() {
    const { SchemaField, NumberField, StringField, BooleanField } = foundry.data.fields;
    const schema = super.defineSchema();

    schema.attackBoost = new SchemaField({
      min: new NumberField({min: 0, max: 9}),
      max: new NumberField({min: 0, max: 9}),
      none: new BooleanField({initial: false}),
    });
    schema.defenseBoost = new SchemaField({
      min: new NumberField({min: 0, max: 9}),
      max: new NumberField({min: 0, max: 9}),
      none: new BooleanField({initial: false}),
    });
    schema.otherBoost = new SchemaField({
      facing: new NumberField({min: 0, max: 9}),
      description: new StringField (),
      none: new BooleanField({initial: false}),
    });

    return schema;
  }

}