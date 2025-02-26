import lwfActorBase from "./base-actor.mjs";

export default class lwfDomain extends lwfActorBase {

  static defineSchema() {
    const { SchemaField, StringField, HTMLField, BooleanField, ArrayField, NumberField } = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.ruler = new StringField();
    // Forces are either added from a character sheet, or added as a custom entry
    schema.forces = new ArrayField(
      new SchemaField({
        name: new StringField(),
        forceStrength: new NumberField({ ...requiredInteger, min: 0, initial: 0 }) 
      })
    );
    // Territory and subjects are either added from Journal entries, or added as a custom entry
    schema.territory = new ArrayField(new StringField());
    schema.subjects = new ArrayField(
      new SchemaField({
        name: new StringField(),
        population: new NumberField({ ...requiredInteger, min: 0, initial: 0})
      })
    )
    schema.laws = new HTMLField();
    return schema
  }

  prepareDerivedData() {
  }
}