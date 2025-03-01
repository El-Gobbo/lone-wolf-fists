import lwfYuddhakala from "./base-yuddhakala.mjs";

export default class lwfForm extends lwfYuddhakala {

  static defineSchema() {
    const { SchemaField, NumberField, StringField, BooleanField } = foundry.data.fields;
    const schema = super.defineSchema();

    schema.requirements = new StringField({ initial: "" });
    schema.attackBoost = new SchemaField({
      name: new StringField(),
      min: new NumberField({min: 0, max: 9}),
      max: new NumberField({min: 0, max: 9}),
      to: new StringField(),
      none: new BooleanField({ initial: false }),
      doubled: new BooleanField({ initial: false })

    });
    schema.defenseBoost = new SchemaField({
      name: new StringField(),
      min: new NumberField({min: 0, max: 9}),
      max: new NumberField({min: 0, max: 9}),
      to: new StringField(),
      none: new BooleanField({ initial: false }),
      doubled: new BooleanField({ initial: false })
    });
    return schema;
  }

}