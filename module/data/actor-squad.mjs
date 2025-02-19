import lwfActorFollower from "./base-follower.mjs";
const HIGHEFFORT = 3;

export default class lwfSquad extends lwfActorFollower {

  static defineSchema() {
    const { StringField, ArrayField, BooleanField } = foundry.data.fields;
    const schema = super.defineSchema();
    
    schema.membership = new ArrayField(new StringField());
    schema.techTableFocus = new StringField({initial: 'forms'});
    schema.updateToggle = new BooleanField ({ initial: false })
    //Determine which member has the highest health, so 
    return schema
  }

  //TODO: changing stats on a monster sheet doesn't immediately change the stats on the squad sheet
  // ATM players need to manually trigger an update of the squad sheet.
  // Possible fix is to check for a master and then update the master whenever the original sheet is altered, but idk.
  prepareDerivedData() {
    let power = 0;
    let health = 0;
    // Numbers is used to track the number of entities in a squad
    // The first index counts the number of entities with power 1-2
    // The second index counts the number of entities with power 3+
    let numbers = [0, 0];
    for(let m of this.namedMembers) {
      const member = fromUuidSync(m);
      power += member.system.power.value;
      health += member.system.health.value;
      if(member.system.power.value <= HIGHEFFORT)
        numbers[0] += 1;
      else
        numbers[1] += 1;
    }
    for(let m of this.members) {
      power += m.power * m.quantity;
      health += m.health * m.quantity;
      if(m.power <= HIGHEFFORT)
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