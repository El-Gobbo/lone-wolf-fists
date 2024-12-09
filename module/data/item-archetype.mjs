import lwfItemBase from "./base-item.mjs";

export default class lwfArchetype extends lwfItemBase {

  static defineSchema() {
    const { SchemaField, BooleanField, NumberField, StringField, ArrayField, HTMLField } = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.archetype = new StringField();

    return schema;
  }
  prepareDerivedData() {
    this.rank = Math.floor(this.agg / 10);

  }

}