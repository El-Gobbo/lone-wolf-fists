import lwfItemBase from "./base-item.mjs";

export default class lwfArchetype extends lwfItemBase {

  static defineSchema() {
    const { StringField } = foundry.data.fields;
    const schema = super.defineSchema();

    schema.archetype = new StringField();

    return schema;
  }
}