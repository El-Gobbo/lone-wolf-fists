import lwfYuddhakala from "./base-yuddhakala.mjs";

export default class lwfTechnique extends lwfYuddhakala {
  async _preCreate(data,options,user){
    await super._preCreate(data, options, user);

    // Get a list of currently held items
    const items = this.parent.parent?.items;

    // If the item is not embedded, exit precreate and create
    if(items === undefined)
      return;

    // if it is, check if the item already exists on the charater sheet
    // If it already exists, exit precreate without creating
    for(let i of items){
      if(i.name === data.name)
        return false;
    }
  }

  static defineSchema() {
    const { SchemaField, NumberField, StringField, BooleanField, HTMLField } = foundry.data.fields;
    const schema = super.defineSchema();

    //Choose if the technique is attack, defense, balance, or mudra
    schema.techType = new StringField({initial: "Attack"});

    schema.techLvl = new StringField({initial: "Novice"});

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

    return schema;
  }

}