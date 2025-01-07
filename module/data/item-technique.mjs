import lwfItemBase from "./base-item.mjs";

export default class lwfTechnique extends lwfItemBase {

  static defineSchema() {
    const { SchemaField, NumberField, StringField, BooleanField, HTMLField } = foundry.data.fields;
    const schema = super.defineSchema();

    // The technique school to which the technique belongs
    schema.yuddhakala = new StringField({initial:"working"});

    //Choose if the technique is attack, defense, versatile, or mudra
    schema.techType = new StringField({initial: "form"});

    schema.techLvl = new StringField({initial: "form"});

    schema.techReqs = new StringField();

    schema.techCost = new NumberField();

    schema.techFacing = new SchemaField({
      min: new NumberField({min: 0, max: 9}),
      max: new NumberField({min: 0, max: 9}),
      none: new BooleanField({initial: false}),
    });

    schema.techSkill = new StringField({initial: "Power"});

    schema.techRank = new NumberField({min: 0, max: 7});

    schema.techTags = new StringField();

    schema.techEffect = new HTMLField();

    return schema;
  }
}