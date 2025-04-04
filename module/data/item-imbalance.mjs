import lwfItemBase from "./base-item.mjs";

export default class lwfImbalance extends lwfItemBase {

  static defineSchema() {
    const { BooleanField, NumberField, StringField } = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.bodyPart = new StringField();
    schema.source = new StringField({initial: "Physical"});
    schema.stat = new StringField({initial: "Effort"});
    schema.rank = new NumberField({...requiredInteger, initial: 1});
    schema.agg = new NumberField({...requiredInteger, initial: 10});
    // if active is true, then the dramatic effect is applied
    // if active is false, then the mechanical effect is applied
    schema.active = new BooleanField({initial: true});

    return schema;
  }
  prepareDerivedData() {
    this.rank = Math.floor(this.agg / 10);

  }

}