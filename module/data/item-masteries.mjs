import lwfItemBase from "./base-item.mjs";

export default class lwfMasteries extends lwfItemBase {

  static defineSchema() {
    const { StringField } = foundry.data.fields;
    const schema = super.defineSchema();

    schema.skill = new StringField({initial: "none"});

    return schema;
  }
}