import lwfItemBase from "./base-item.mjs";

export default class lwfAbility extends lwfItemBase {

  static defineSchema() {
    const { SchemaField, BooleanField, NumberField, StringField, ArrayField, HTMLField } = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.type = new StringField();
    schema.ranks = new NumberField({ ...requiredInteger, min: 0 });
    schema.frequency = new NumberField();
    schema.cost = new NumberField({ min: 1 })

    return schema;
  }
  prepareDerivedData() {


  }

}