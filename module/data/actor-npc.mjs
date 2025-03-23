import lwfActorChakras from "./base-chakras.mjs";

export default class lwfNpc extends lwfActorChakras {

  static defineSchema() {
    const { NumberField, BooleanField, HTMLField } = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();
    schema.isHero = new BooleanField({ initial: false })
    schema.hasChakra = new BooleanField({ initial: false });
    schema.hasTechniques = new BooleanField({ initial: false });
    schema.size = new NumberField({ ...requiredInteger, initial: 0, min: 0 });
    schema.abilities = new HTMLField();
    
    return schema
  }

  prepareDerivedData() {
    this.health.max = this.health.lvl * 10;

    if(!this.hasChakra)
      return;
    this.prana.gen.outOfCombat = this.pool.lvl * this.chakras.value;
    this.prana.gen.inCombat = this.pool.recovery * this.chakras.value;
    if(!this.parent.inCombat)
      this.prana.value = this.prana.gen.outOfCombat;
    
  }
}