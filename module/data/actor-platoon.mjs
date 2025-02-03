const BONUS = 10;
const POWER = 10;
const HEALTH = 10;
const DEFENSE = 25;
import lwfWeaponUser from "./base-weaponuser.mjs";

export default class lwfSquad extends lwfWeaponUser {

  static defineSchema() {
    const { BooleanField, NumberField, StringField, ArrayField, HTMLField } = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.platoonType = new StringField();
    schema.description = new HTMLField();
    schema.tactics = new HTMLField();
    schema.membership = new NumberField({ ...requiredInteger, min: 0, max: 100 });
    schema.defense = new NumberField({ ...requiredInteger, min: 1, max: 5 });
    schema.bonus = new NumberField({ ...requiredInteger, min: 0, max: 10 });
    
    return schema
  }

  prepareDerivedData() {
    // Derive power, health, defense, and bonus from membership numbers
    if(editMode) {
      this.health.value = this.membership;
      this.heath.max = this.health.value * HEALTH;
      this.health.current = this.health.max
    }
    else {
      this.membership = Math.ceil(this.health.current / HEALTH);
    }
    this.bonus = Math.floor(this.membership / BONUS);
    this.defense = 1 + Math.floor(this.defense / DEFENSE);
    this.power.value = Math.ceil(this.membership / POWER);
  }
}