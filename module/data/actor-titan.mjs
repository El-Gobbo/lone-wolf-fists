import lwfActorBase from "./base-actor.mjs";

export default class lwfTitan extends lwfActorBase {

  static defineSchema() {
    const { SchemaField, StringField, HTMLField, BooleanField } = foundry.data.fields;
    const schema = super.defineSchema();

    schema.cataclysms = new StringField();

    // True means cataclysm, false means titan
    schema.type = new BooleanField({ initial: false});
    schema.onslaught = new SchemaField({
      core: new StringField(),
    })
    schema.calamity = new StringField(),
    schema.duration = new HTMLField();
    schema.scope = new StringField();
    
    return schema
  }

  prepareDerivedData() {
    this.health.max = this.health.value * 10;
  }
}