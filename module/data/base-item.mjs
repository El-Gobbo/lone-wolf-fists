import lwfDataModel from "./base-model.mjs";

export default class lwfItemBase extends lwfDataModel {
  async _preCreate(data,options,user){
    await super._preCreate(data, options, user);

    // Get a list of currently held items
    const items = this.parent.parent?.items;

    // If the item is not embedded, exit precreate and create
    if(items === undefined || data.type === 'ability' || data.type === 'imbalance')
      return;

    // if it is, check if an item of the same name already exists on the charater sheet
    // If it already exists, exit precreate without creating
    for(let i of items){
      if(i.name === data.name)
        return false;
    }
  }
  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = {};

    schema.description = new fields.HTMLField();
    schema.editMode = new fields.BooleanField({initial: false})
    return schema;
  }

}