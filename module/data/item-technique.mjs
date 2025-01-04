import lwfItemBase from "./base-item.mjs";

export default class lwfTechnique extends lwfItemBase {

  static defineSchema() {
    const { SchemaField, NumberField, StringField, ArrayField, BooleanField, HTMLField } = foundry.data.fields;
    const schema = super.defineSchema();

    // The technique school to which the technique belongs
    schema.yuddhakala = new StringField();

    //Choose if the technique is attack, defense, versatile, or mudra
    schema.techType = new StringField();

    schema.techLvl = new StringField();

    schema.techCost = new NumberField();

    schema.techFacing = new SchemaField({
      min: new NumberField({min: 0, max: 9}),
      max: new NumberField({min: 0, max: 9}),
      none: new BooleanField({initial: false})
    });

    schema.techSkill = new StringField();

    schema.techRank = new NumberField({min: 1, max: 7});

    schema.techTags = new StringField();

    schema.techEffect = new HTMLField();

    schema.test = new ArrayField(new StringField, {initial: ['test', 'next', 'value']});

    return schema;
  }
}