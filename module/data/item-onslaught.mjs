import lwfItemBase from "./base-item.mjs";

export default class lwfOnslaught extends lwfItemBase {

  static defineSchema() {
    const { NumberField, BooleanField, SchemaField, StringField } = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.frequency = new SchemaField({
      number: new NumberField({ ...requiredInteger, initial: 0, min: 0 }),
      interval: new StringField({ initial: "Round" }),
    }) 
    schema.calamityToggle = new BooleanField({initial: false});
    
    return schema;
  }
}