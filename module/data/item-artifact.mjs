import lwfTechnique from "./item-technique.mjs";

export default class lwfArtifact extends lwfTechnique {

  static defineSchema() {
    const { StringField, BooleanField, HTMLField, SchemaField, NumberField } = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();

    schema.tier = new StringField({initial: "Bauble"});
    schema.type = new StringField({initial: "Item"});

    // These tags are here to allow artifacts to display in the weapon table
    schema.tag1 = new StringField({initial: "Balanced+"});
    schema.tag1Effect = new StringField({ initial: '' });
    schema.tag2 = new StringField({initial: "Balanced+"});
    schema.tag2Effect = new StringField({ initial: '' });
    schema.unique = new BooleanField({initial: false});
    schema.size = new NumberField({ ...requiredInteger, initial: 0});
    schema.held = new BooleanField({initial: false});

    // These tags are here to allow artifacts to display in the armor table
    schema.armorValue = new NumberField({ ...requiredInteger, initial: 0});
    schema.worn = new BooleanField({initial: false});

    schema.chakra = new SchemaField({
      hasChakra: new BooleanField({initial: false}),
      description: new HTMLField(),
    })

    schema.soul = new SchemaField({
      hasSoul: new BooleanField({initial: false}),
      description: new HTMLField(),
      dharma: new StringField(),
    })

    schema.hasTechnique = new BooleanField({initial: false});
    schema.techniqueName = new StringField();

    schema.shakti = new HTMLField({initial: ""});
    schema.artifactDescription = new HTMLField({initial: ""});
    
    return schema;
  }

  prepareDerivedData() {
    this.techReqs = this.parent.name;

  }
}