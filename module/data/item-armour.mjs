import lwfItemBase from "./base-item.mjs";

export default class lwfArmour extends lwfItemBase {

  static defineSchema() {
    const { NumberField } = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.armour = new NumberField({ ...requiredInteger, initial: 0});
    
    return schema;
  }
}