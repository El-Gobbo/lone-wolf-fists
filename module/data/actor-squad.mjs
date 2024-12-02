import lwfWeaponUser from "./base-weaponuser.mjs";

export default class lwfSquad extends lwfWeaponUser {

  static defineSchema() {
    const { SchemaField, NumberField, StringField, ArrayField, HTMLField } = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.weapons = new ArrayField(new StringField());
    
    // Members of a squad form part of an array, each part of which has it's own power and health. This is to allow more complex squads
    schema.members = new ArrayField(
      new SchemaField({
        power: new NumberField({...requiredInteger, initial: 1}),
        health: new NumberField({...requiredInteger, initial: 1})
      })
    );


    
    return schema
  }

  prepareDerivedData() {
    // Derive power and health from the total power and health of the squad members
    let power = 0;
    let health = 0;
    
    // NOTE: THIS IS CURENTLY UNTESTED - RETURN TO THIS LATER!
    for(let x in this.members)
    {
      console.log(x)
      power += this.members[x].power;
      health += this.members[x].health;
      console.log(power)
      console.log(health)
    }
    
    this.power.value = power;
    this.health.value = health;

    this.health.max = this.health.value * 10;
  }
}