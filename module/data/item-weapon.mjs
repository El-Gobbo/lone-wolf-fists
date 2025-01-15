import lwfItemBase from "./base-item.mjs";

export default class lwfWeapon extends lwfItemBase {

  static defineSchema() {
    const { StringField, BooleanField, HTMLField } = foundry.data.fields;

    const schema = super.defineSchema();

    schema.tag1 = new StringField({initial: "Balanced"});
    schema.tag2 = new StringField({initial: "Balanced"});
    schema.unique = new BooleanField({initial: false});
    schema.unorthodox = new BooleanField({initial: false});
    schema.history = new HTMLField({initial: ""});
    
    return schema;
  }
}