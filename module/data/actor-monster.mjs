import lwfActorChakras from "./base-chakras.mjs";

export default class lwfMonster extends lwfActorChakras {

  static defineSchema() {
    const { SchemaField, NumberField, BooleanField, StringField, ArrayField, HTMLField } = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();
    schema.isHero = new BooleanField({ initial: false })
    schema.chakras.hasChakra = new BooleanField({ initial: false });
    schema.hasTechniques = new BooleanField({ initial: false });
    schema.size = new NumberField({ ...requiredInteger, min: 0, initial: 1 });
    schema.abilities = new HTMLField();
    
    return schema
  }

  prepareDerivedData() {
    this.health.max = this.health.value * 10;

    if(!this.chakras.hasChakra)
      return;
    this.prana.gen.outOfCombat = this.pool.value * this.chakras.active;
    this.prana.gen.inCombat = this.pool.recovery * this.chakras.active;
    if(!this.parent.inCombat)
      this.prana.current = this.prana.gen.outOfCombat;
    
  }
}