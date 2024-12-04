import lwfItemBase from "./base-item.mjs";

export default class lwfImbalance extends lwfItemBase {

  static defineSchema() {
    const { SchemaField, BooleanField, NumberField, StringField, ArrayField, HTMLField } = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.location = new StringField({initial:"I"});
    schema.effect = new StringField({initial:"Like"});
    schema.stat = new StringField({initial:"big"});
    schema.rank = new NumberField({...requiredInteger, initial: 69});
    schema.aggravation = new NumberField({...requiredInteger, initial: 10});
    // if active is true, then the dramatic effect is applied
    // if active is false, then the mechanical effect is applied
    schema.active = new BooleanField({initial: true});

    return schema;
  }
  prepareDerivedData() {
    this.rank = Math.floor(this.aggravation / 10);

  }

}