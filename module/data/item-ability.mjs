import lwfItemBase from "./base-item.mjs";
import { LWFABILITIES } from "../helpers/abilities.mjs";

export default class lwfAbility extends lwfItemBase {

  static defineSchema() {
    const { SchemaField, NumberField, StringField } = foundry.data.fields;
    const schema = super.defineSchema();
    schema.subtype = new StringField({ initial: 'Power' });
    schema.effect = new SchemaField({
      target: new StringField({ initial: 'Attack' }),
      intensity: new StringField({ initial: 'Rank 1'}),
      frequency: new NumberField({ nullable: false, integer: true, initial: 1, min: 1 }),
      duration: new StringField({ initial: 'Round'}),
      sets: new NumberField({ nullable: false, integer: true, initial: 2, min: 1 })
    });

    return schema;
  }
  prepareDerivedData() {

  }
}