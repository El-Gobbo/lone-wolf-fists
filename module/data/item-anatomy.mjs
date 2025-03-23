import lwfItemBase from "./base-item.mjs";

export default class lwfAnatomy extends lwfItemBase {
  //TODO: this updates twice when edit mode is toggled on the character sheet - why?


  static defineSchema() {
    const { SchemaField, NumberField, StringField, BooleanField } = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.health = new SchemaField({
      lvl: new NumberField({ ...requiredInteger, initial: 1, min: 0 }),
      value: new NumberField({ ...requiredInteger, initial: 10, min: 0 }),
      max: new NumberField({ ...requiredInteger, initial: 10, min: 0 }),
    })
    schema.armor = new NumberField({ ...requiredInteger, initial: 0, min: 0 });
    // Toggles if being used as a system or as anatomy
    schema.systemToggle = new BooleanField({ initial: false })
    // Stores the id of the onslaught linked to this body part
    schema.linkedOnslaught = new StringField();

    return schema;
  }
  prepareDerivedData() {
    if((this.parent?.parent?.system !== undefined))
      this.armor = Math.floor(this.parent.parent.system.armor / 2);
    if(this.parent?.parent?.type === 'vehicle')
      this.systemToggle = true;
    this.health.max = this.health.lvl * 10;
  }

}