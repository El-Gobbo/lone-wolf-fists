import lwfActorBase from "./base-actor.mjs";

// To allow for squads to have variable members, and to show disciples on character sheets
export default class lwfActorFollower extends lwfActorBase {
  static defineSchema() {
    const { NumberField, SchemaField, StringField, ArrayField, BooleanField } = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();
    schema.master = new SchemaField({
      id: new StringField({initial: ""}),
      isRuler: new BooleanField({ initial: false }),
      loyalty: new SchemaField({
        lvl: new NumberField({ integer: true, initial: 0, min: 0, max: 10 })
      })
    });
    schema.members = new ArrayField(
      new SchemaField({
        img: new StringField({ initial: "systems/lone-wolf-fists/assets/meeple/person.svg" }),
        creature: new StringField(),
        power: new NumberField({ ...requiredInteger, initial: 1, min: 1 }),
        health: new NumberField({ ...requiredInteger, initial: 1, min: 1 }),
        quantity: new NumberField({ ...requiredInteger, initial: 1, min: 0 }),
        loyalty: new NumberField({ integer: true, min: 0, max: 10 }),
      })
    );
    schema.namedMembers = new ArrayField(new StringField());
    return schema;
  }
}