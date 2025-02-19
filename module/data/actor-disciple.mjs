import lwfActorChakras from "./base-chakras.mjs";

export default class lwfDisciple extends lwfActorChakras {

  static defineSchema() {
    const { SchemaField, NumberField, BooleanField, ArrayField, HTMLField } = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.loyalty = new NumberField({ ...requiredInteger, min: 1, max: 10, initial: 1 });
    schema.focus = new NumberField({ ...requiredInteger, min: 0, initial: 0 })
    return schema;
  }
  prepareDerivedData() {
    
  }

}