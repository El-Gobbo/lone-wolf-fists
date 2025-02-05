import lwfWeaponUser from "./base-weaponuser.mjs";
const HIGHEFFORT = 3;

export default class lwfSquad extends lwfWeaponUser {

  static defineSchema() {
    const { SchemaField, NumberField, StringField, ArrayField, HTMLField } = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();
    
    // Members of a squad form part of an array, each part of which has it's own power and health. This is to allow more complex squads
    schema.members = new ArrayField(
      new SchemaField({
        img: new StringField({ initial: "systems/lone-wolf-fists/assets/icons/person.svg" }),
        creature: new StringField(),
        effort: new NumberField({ ...requiredInteger, initial: 1, min: 1 }),
        health: new NumberField({ ...requiredInteger, initial: 1, min: 1 }),
        quantity: new NumberField({ ...requiredInteger, initial: 1, min: 0 }),
      })
    );
    schema.namedMembers = new ArrayField(new StringField());
    schema.membership = new ArrayField(new StringField());
    schema.techTableFocus = new StringField({initial: 'forms'});
    //Determine which member has the highest health, so 
    return schema
  }

  prepareDerivedData() {
    let power = 0;
    let health = 0;
    // Numbers is used to track the number of entities in a squad
    // The first index counts the number of entities with power 1-2
    // The second index counts the number of entities with power 3+
    let numbers = [0, 0];
    for(let m of this.namedMembers) {
      const member = game.actors?.get(m);
      power += member.system.power.value;
      health += member.system.health.value;
      if(member.system.power.value <= HIGHEFFORT)
        numbers[0] += 1;
      else
        numbers[1] += 1;
    }
    for(let m of this.members) {
      power += m.effort * m.quantity;
      health += m.health * m.quantity;
      if(m.effort <= HIGHEFFORT)
        numbers[0] += m.quantity;
      else
        numbers[1] += m.quantity;
    }
    if(power > 10)
      power = 10;
    this.power.value = power;
    this.health.value = health;
    const membershipLow = new Array(numbers[0]).fill(false);
    const membershipHigh = new Array(numbers[1]).fill(true);
    this.membership = membershipLow.concat(membershipHigh);
    this.health.max = this.health.value * 10;
  }
}