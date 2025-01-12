import lwfItemBase from "./base-item.mjs";

export default class lwfTechnique extends lwfItemBase {

  static defineSchema() {
    const { SchemaField, NumberField, StringField, BooleanField, HTMLField } = foundry.data.fields;
    const schema = super.defineSchema();

    // The technique school to which the technique belongs
    schema.yuddhakala = new StringField({initial:""});

    //Choose if the technique is attack, defense, versatile, or mudra
    schema.techType = new StringField({initial: "attack"});

    schema.techLvl = new StringField({initial: "novice"});

    schema.techReqs = new StringField();

    schema.techCost = new NumberField();

    schema.techFacing = new SchemaField({
      min: new NumberField({min: 0, max: 9}),
      max: new NumberField({min: 0, max: 9}),
      none: new BooleanField({initial: false}),
    });

    schema.isForm = new SchemaField({
      attackBoost: new SchemaField({
        min: new NumberField({min: 0, max: 9}),
        max: new NumberField({min: 0, max: 9}),
        none: new BooleanField({initial: false}),
      }),
      defenseBoost: new SchemaField({
        min: new NumberField({min: 0, max: 9}),
        max: new NumberField({min: 0, max: 9}),
        none: new BooleanField({initial: false}),
      }),
      otherBoost: new SchemaField({
        facing: new NumberField({min: 0, max: 9}),
        description: new StringField (),
        none: new BooleanField({initial: false}),
      }),
    })

    schema.techSkill = new StringField({initial: "Power"});

    schema.techRank = new NumberField({min: 0, max: 7});

    schema.techTags = new StringField();

    schema.techEffect = new HTMLField();

    return schema;
  }

  prepareDerivedData() {
    // If the technique is of the form level, make it of the form type as well
    if (this.techLvl === "form")
      this.techType = this.techLvl;;
  }
}