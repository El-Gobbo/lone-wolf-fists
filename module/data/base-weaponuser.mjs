import lwfActorBase from "./base-actor.mjs";

export default class lwfWeaponUser extends lwfActorBase {
// For all the actor types that wield weapons
  static defineSchema() {
    const { ArrayField, StringField } = foundry.data.fields;
    const schema = super.defineSchema();
    schema.weapon = new ArrayField(new StringField());
    
    return schema;
  }

}