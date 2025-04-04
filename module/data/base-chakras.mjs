import lwfActorFollower from "./base-follower.mjs";

export default class lwfActorChakras extends lwfActorFollower {
// For all the actor types that wield weapons
  static defineSchema() {
    const { NumberField, SchemaField, BooleanField, StringField } = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();
    // All the relevant datafields relating to chakras and Prana generation
    schema.prana = new SchemaField({
      value: new NumberField({ ...requiredInteger, initial: 0, min: 0, max: 100 }),
      max: new NumberField({ ...requiredInteger, initial: 100, min: 100, max: 100}),
      gen: new SchemaField({
        outOfCombat: new NumberField({...requiredInteger, initial: 0}),
        inCombat: new NumberField({...requiredInteger, initial: 0 }),
        bonus: new NumberField({ ...requiredInteger, initial: 0})
      }),
    });

    // Datafields about amount of prana generated per chakra
    // This is seperate from the prior category to make setting the default values easier
    schema.pool = new SchemaField({
      lvl: new NumberField({ ...requiredInteger, initial: 0, min: 0 }),
      recovery: new NumberField({ ...requiredInteger, initial: 0, min: 0 })
    });
    schema.chakras = new SchemaField ({
     //value == initial chakras
      lvl: new NumberField({ ...requiredInteger, initial: 1, min: 1, max: 7 }),
      value: new NumberField({ ...requiredInteger, initial: 1, min: 1, max: 7 }),
      max: new NumberField({ ...requiredInteger, initial: 7, min: 7, max: 7}),
      hellToggle: new BooleanField({initial: false}),
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
    schema.techTableFocus = new StringField({initial: 'all'});
    
    return schema;
  }

}