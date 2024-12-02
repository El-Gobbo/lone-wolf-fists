import lwfActorBase from "./base-actor.mjs";

export default class lwfMonster extends lwfActorBase {

  static defineSchema() {
    const { SchemaField, NumberField, StringField, ArrayField, HTMLField } = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.size = new NumberField({ ...requiredInteger, initial: 1});
    schema.abilities = new HTMLField();
    
    return schema
  }

  prepareDerivedData() {
    this.health.max = this.health.value * 10;
  }
}