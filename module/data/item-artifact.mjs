import lwfItemBase from "./base-item.mjs";

export default class lwfArtifact extends lwfItemBase {

  static defineSchema() {
    const { StringField, BooleanField, HTMLField, SchemaField, NumberField } = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.tier = new StringField({initial: "Bauble"});
    schema.type = new StringField({initial: "Item"});

    schema.Weapon = new SchemaField({
      tag1: new StringField({initial: "Special"}),
      tag2: new StringField({initial: "Special"}),
      unique: new BooleanField({initial: false}),
      unorthodox: new BooleanField({initial: false}),
    });

    schema.Armor = new SchemaField({
      armorValue: new NumberField({ ...requiredInteger, initial: 0}),
      worn: new BooleanField({initial: false})
    });

    schema.techniqueUUID = new StringField();

    schema.history = new HTMLField({initial: ""});
    
    return schema;
  }
}