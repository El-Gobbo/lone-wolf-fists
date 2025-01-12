import lwfItemBase from "./base-item.mjs";

export default class lwfYuddhakala extends lwfItemBase {
// For all the actor types that wield weapons
  static defineSchema() {
    const { StringField, HTMLField } = foundry.data.fields;
    const schema = super.defineSchema();
    schema.yuddhakala = new StringField();
    schema.techEffect = new HTMLField();
    
    return schema;
  }

}