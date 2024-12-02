import lwfWeaponUser from "./base-weaponuser.mjs";

export default class lwfSquad extends lwfWeaponUser {

  static defineSchema() {
    const { SchemaField, NumberField, StringField, ArrayField, HTMLField } = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.weapons = new ArrayField(new StringField());
    
    // Members of a squad form part of an array, each part of which has it's own power and health. This is to allow more complex squads



    
    return schema
  }

  prepareDerivedData() {
    // Derive power and health from the total power and health of the squad members

  }
}