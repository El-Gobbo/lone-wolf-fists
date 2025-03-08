import { LWFDOMAINS } from "../helpers/domains.mjs";
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
        type: new StringField(),
        location: new StringField(),
        strength: new NumberField({ ...requiredInteger, min: 0, initial: 0 }),
        quantity: new NumberField({ ...requiredInteger, min: 0, initial: 1 }),
        strengthFixed: new BooleanField({ initial: false })
      })
    );
    // Territory and subjects are either added from Journal entries, or added as a custom entry
    schema.territory = new ArrayField(
      new SchemaField({
        name: new StringField()
      })
    );
    schema.subjects = new ArrayField(
      new SchemaField({
        name: new StringField(),
        population: new NumberField({ ...requiredInteger, min: 0, initial: 0}),
        location: new StringField()
      })
    )
    schema.laws = new ArrayField (
      new SchemaField({
        details: new HTMLField()
      })
    );
    return schema
  }

  prepareDerivedData() {
  }
}