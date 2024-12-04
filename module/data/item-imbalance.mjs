import lwfItemBase from "./base-item.mjs";

export default class lwfImbalance extends lwfItemBase {

  static defineSchema() {
    const { SchemaField, BooleanField, NumberField, StringField, ArrayField, HTMLField } = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.location = new StringField();
    schema.source = new StringField();
    schema.stat = new StringField({initial: "physical"});
    schema.rank = new NumberField({...requiredInteger, initial: 1});
    schema.agg = new NumberField({...requiredInteger, initial: 10});
    // if active is true, then the dramatic effect is applied
    // if active is false, then the mechanical effect is applied
    schema.active = new BooleanField({initial: true});

    return schema;
  }
  prepareDerivedData() {
    this.rank = Math.floor(this.agg / 10);

  }

}