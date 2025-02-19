const BONUS = 10;
const POWER = 10;
const HEALTH = 10;
const DEFENSE = 25;
import lwfActorBase from "./base-actor.mjs";

export default class lwfPlatoon extends lwfActorBase {
  static defineSchema() {
    const { BooleanField, NumberField, StringField, SchemaField, HTMLField } = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.platoonType = new StringField();
    schema.tactics = new HTMLField();
    schema.capabilities = new HTMLField();
    schema.membership = new SchemaField({
      max: new NumberField({ ...requiredInteger, initial: 1, min: 0, max: 100 }),
      current: new NumberField({ ...requiredInteger, initial: 1, min: 0, max: 100 }),
    });
    schema.defense = new NumberField({ ...requiredInteger, initial: 1, min: 1, max: 5 });
    schema.bonus = new NumberField({ ...requiredInteger, initial: 0, min: 0, max: 10 });
    
    return schema
  }

  prepareDerivedData() {
    // Derive power, health, defense, and bonus from membership numbers
    this.health.value = this.membership.max;
    this.health.max = this.health.value * HEALTH;
    if(!this.editMode) {
      this.membership.current = Math.ceil(this.health.current / HEALTH);
    }
    if(this.health.current > this.health.max)
      this.health.current = this.health.max;
    this.bonus = Math.floor(this.membership.current / BONUS);
    this.defense = 1 + Math.floor(this.membership.current / DEFENSE);
    this.power.value = Math.ceil(this.membership.current / POWER);
  }
}