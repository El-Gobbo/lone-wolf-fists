import lwfItemBase from "./base-item.mjs";

export default class lwfMasteries extends lwfItemBase {
  async _preCreate(data,options,user){
    await super._preCreate(data, options, user);

    // Get a list of currently held items
    const items = this.parent.parent?.items;

    // If the item is not embedded, exit precreate and create
    if(items === undefined)
      return;

    // if it is, check if an item of the same name already exists on the charater sheet
    // If it already exists, exit precreate without creating
    for(let i of items){
      if(i.name === data.name)
        return false;
    }
  }
  static defineSchema() {
    const { StringField } = foundry.data.fields;
    const schema = super.defineSchema();

    schema.skill = new StringField({initial: "none"});

    return schema;
  }
}