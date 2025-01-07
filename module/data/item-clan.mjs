import lwfItemBase from "./base-item.mjs";

export default class lwfClan extends lwfItemBase {

  static defineSchema() {
    const { SchemaField, BooleanField, NumberField, StringField, ArrayField, HTMLField } = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.clan = new StringField();
    schema.deed = new HTMLField();
    schema.vice = new HTMLField();
    schema.landmark - new HTMLField();

    return schema;
  }
  prepareDerivedData() {

  }

}