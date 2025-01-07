import lwfItemBase from "./base-item.mjs";

export default class lwfWeapon extends lwfItemBase {

  static defineSchema() {
    const { SchemaField, BooleanField } = foundry.data.fields;

    const schema = super.defineSchema();

    schema.adv = new SchemaField ({
      unarmed: new BooleanField({initial: false}),
      reflexive: new BooleanField({initial: false}),
      balanced: new BooleanField({initial: false}),
      reach: new BooleanField({initial: false}),
      heavy: new BooleanField({initial: false}),
      ranged: new BooleanField({initial: false}),
      flexible: new BooleanField({initial: false}),
      subtle: new BooleanField({initial: false}),
      improvised: new BooleanField({initial: false}),
      warfighter: new BooleanField({initial: false}),
      grenade: new BooleanField({initial: false}),
      ordnance: new BooleanField({initial: false}),
    })
    schema.unique = new BooleanField({initial: false});
    
    return schema;
  }
}