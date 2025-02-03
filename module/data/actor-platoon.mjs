import lwfWeaponUser from "./base-weaponuser.mjs";

export default class lwfSquad extends lwfWeaponUser {

  static defineSchema() {
    const { SchemaField, NumberField, StringField, ArrayField, HTMLField } = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.platoonType = new StringField();
    schema.membership = new NumberField({ ...requiredInteger, min: 0, max: 100 });
    schema.description = new HTMLField();
    schema.tactics = new HTMLField();
    
    return schema
  }

  prepareDerivedData() {
    // Derive power and health from the total power and health of the squad members

  }
}