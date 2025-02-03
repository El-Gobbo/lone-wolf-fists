import lwfActorBase from "./base-actor.mjs";

export default class lwfMonster extends lwfActorBase {

  static defineSchema() {
    const { SchemaField, NumberField, BooleanField, ArrayField, HTMLField } = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.chakras = new SchemaField ({
      value: new NumberField({ ...requiredInteger, initial: 1, min: 1, max: 7 }),
      hasChakra: new BooleanField({initial: false}),
      active: new NumberField({ ...requiredInteger, initial: 1, min: 1, max: 7 }),
      hellToggle: new BooleanField({initial: true}),
      awakened: new SchemaField({
        Hell: new BooleanField({initial: false}),
        Heaven: new BooleanField({initial: false}),
        Metal: new BooleanField({initial: false}),
        Wood: new BooleanField({initial: false}),
        Air: new BooleanField({initial: false}),
        Fire: new BooleanField({initial: false}),
        Water: new BooleanField({initial: false}),
        Earth: new BooleanField({initial: false}),
      })
    });

    // All the relevant datafields relating to chakras and Prana generation
    schema.prana = new SchemaField({
      current: new NumberField({ ...requiredInteger, initial: 0, min: 0, max: 100 }),
      gen: new SchemaField({
        outOfCombat: new NumberField({...requiredInteger, initial: 0}),
        inCombat: new NumberField({...requiredInteger, initial: 0 }),
      }),
    });

    // Datafields about amount of prana generated per chakra
    // This is seperate from the prior category to make setting the default values easier
    schema.pool = new SchemaField({
      value: new NumberField({ ...requiredInteger, initial: 0, min: 0 }),
      recovery: new NumberField({ ...requiredInteger, initial: 0, min: 0 })
    });


    schema.hasTechniques = new BooleanField({initial: false});
    schema.description = new HTMLField();

    schema.size = new NumberField({ ...requiredInteger, initial: 1});
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