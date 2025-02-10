import lwfActorBase from "./base-actor.mjs";

export default class lwfTitan extends lwfActorBase {

  static defineSchema() {
    const { SchemaField, NumberField, StringField, ArrayField, HTMLField, BooleanField } = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();


    schema.description = new HTMLField();
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
    if(this.type === false) {
      this.scope = "Field";
    }
  
  }
}