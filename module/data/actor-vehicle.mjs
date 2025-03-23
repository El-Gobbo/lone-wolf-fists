import lwfActorBase from "./base-actor.mjs";

export default class lwfVehicle extends lwfActorBase {

  static defineSchema() {
    const { SchemaField, NumberField, StringField } = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.fuel = new SchemaField({
      quantity: new NumberField({ ...requiredInteger, initial: 0, min: 0 }),
      duration: new StringField({ initial: 'Scene' }),
    })
    schema.mass = new SchemaField({
      size: new NumberField({ ...requiredInteger, initial: 0, min: 0 }),
      weight: new NumberField({ ...requiredInteger, initial: 0, min: 0 }),
    })
    schema.movement = new SchemaField({
      speed: new NumberField({ ...requiredInteger, initial: 0, min: 0 }),
      handling: new NumberField({ ...requiredInteger, initial: 0, min: 0 }),
    })
    schema.terrainTypes = new StringField();
    schema.towing = new NumberField({ ...requiredInteger, initial: 0, min: 0 }),
    schema.occupancy = new SchemaField({
      crew: new StringField({ initial: "1" }),
      cargo: new StringField({ initial: "1" }),
    })
    return schema
  }

  prepareDerivedData() {
    this.health.max = this.health.lvl * 10;
  }
}