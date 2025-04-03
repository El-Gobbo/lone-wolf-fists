import lwfItemBase from "./base-item.mjs";

export default class lwfWeapon extends lwfItemBase {

  static defineSchema() {
    const { StringField, BooleanField, HTMLField, NumberField } = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.tag1 = new StringField({initial: "Balanced"});
    schema.tag2 = new StringField({initial: "Balanced"});
    schema.strength = new NumberField({integer: true, min: 0, initial: 0})
    schema.held = new BooleanField({initial: false});
    schema.unique = new BooleanField({initial: false});
    schema.unorthodox = new BooleanField({initial: false});
    schema.size = new NumberField({ ...requiredInteger, initial: 0});
    schema.history = new HTMLField({initial: ""});
    
    return schema;
  }
}