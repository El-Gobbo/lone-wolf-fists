import lwfWeaponUser from "./base-weaponuser.mjs";

export default class lwfSquad extends lwfWeaponUser {

  static defineSchema() {
    const { SchemaField, NumberField, StringField, ArrayField, HTMLField } = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();
    
    // Members of a squad form part of an array, each part of which has it's own power and health. This is to allow more complex squads
    schema.members = new ArrayField(
      new SchemaField({
        creature: new StringField(),
        effort: new NumberField({ ...requiredInteger, initial: 1, min: 1 }),
        health: new NumberField({ ...requiredInteger, initial: 1, min: 1 }),
        quantity: new NumberField({ ...requiredInteger, initial: 1, min: 0 }),
      })
    );
    schema.namedMembers = new ArrayField(new StringField());
    return schema
  }

  prepareDerivedData() {
    let power = 0;
    let health = 0;
    for(let m of this.namedMembers) {
      const member = game.actors?.get(m);
      power += member.system.power.value;
      health += member.system.health.value;
    }
    for(let m of this.members) {
      power += m.effort * m.quantity;
      health += m.health * m.quantity;
    }
    if(power > 10)
      power = 10;
    this.power.value = power;
    this.health.value = health;

    this.health.max = this.health.value * 10;
  }
}