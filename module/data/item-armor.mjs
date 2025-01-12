import lwfItemBase from "./base-item.mjs";

export default class lwfArmor extends lwfItemBase {

  static defineSchema() {
    const { NumberField } = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.armor = new NumberField({ ...requiredInteger, initial: 0});
    
    return schema;
  }
}