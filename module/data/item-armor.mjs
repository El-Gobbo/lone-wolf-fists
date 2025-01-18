import lwfItemBase from "./base-item.mjs";

export default class lwfArmor extends lwfItemBase {

  static defineSchema() {
    const { NumberField, BooleanField } = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.armorValue = new NumberField({ ...requiredInteger, initial: 0});
    schema.worn = new BooleanField({initial: false});
    
    return schema;
  }
}