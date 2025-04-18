import lwfDataModel from "./base-model.mjs";

export default class lwfActorBase extends lwfDataModel {

  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = {};

    schema.health = new fields.SchemaField({
      lvl: new fields.NumberField({ ...requiredInteger, initial: 1, min: 0 }),
      max: new fields.NumberField({ ...requiredInteger, initial: 10, min: 0}),
      value: new fields.NumberField({ ...requiredInteger, initial: 10 }),
    });
    schema.power = new fields.SchemaField({
      lvl: new fields.NumberField({ ...requiredInteger, initial: 0, min: 0 }),
    });
    schema.armor = new fields.NumberField({ ...requiredInteger, initial: 0});
    schema.biography = new fields.StringField({ required: true, blank: true }); // equivalent to passing ({initial: ""}) for StringFields
    schema.initiative = new fields.SchemaField({
      advantage: new fields.BooleanField({ required: true, initial: false }),
      modifiers: new fields.StringField({ required: true, initial: "" }),
    });
    schema.editMode = new fields.BooleanField({initial: true});
    schema.description = new fields.HTMLField();
    return schema;
  }

}