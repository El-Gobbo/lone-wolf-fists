import lwfItemBase from "./base-item.mjs";

export default class lwfGuptKala extends lwfItemBase {

  static defineSchema() {
    const { HTMLField } = foundry.data.fields;
    const schema = super.defineSchema();

    schema.powers = new HTMLField();

    return schema;
  }

}