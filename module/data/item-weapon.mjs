import lwfItemBase from "./base-item.mjs";

export default class lwfWeapon extends lwfItemBase {

  static defineSchema() {
    const { StringField, BooleanField } = foundry.data.fields;

    const schema = super.defineSchema();

    schema.tag1 = new StringField();
    schema.tag2 = new StringField();
    schema.unique = new BooleanField({initial: false});
    
    return schema;
  }
}