import lwfItemBase from "./base-item.mjs";
import { LWFNODES } from "../helpers/nodes.mjs";

export default class lwfNode extends lwfItemBase {

  static defineSchema() {
    const { NumberField, BooleanField, StringField, SchemaField, ArrayField } = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = super.defineSchema();
    
    schema.location = new StringField();
    // What type of node it is. This includes all the basic types of node, plus market. See ../helpers/nodes.mjs for what the values mean
    schema.nodeType = new SchemaField({
      value: new NumberField({ ...requiredInteger, min: 0, max: 9, initial: 0 }),
      name: new StringField()
    });
    schema.richness = new SchemaField({
      value: new NumberField({ ...requiredInteger, min: 0, max: 2, initial: 1 }),
      name: new StringField()
    });
    //Everything to do with the node's level of development. None of this should be used if hasFactory is false
    schema.development = new SchemaField({
      powerPlant: new BooleanField({ initial: false }),
      level: new SchemaField({
        value: new NumberField({ ...requiredInteger, min: 0, max: 2, initial: 0 }),
        name: new StringField()
      }),
      product: new SchemaField({
        value: new NumberField({ required: true, integer: true, nullable: false, min: 0, max: 5, initial: 0 }),
        name: new StringField()
      }),
      cost: new NumberField({ ...requiredInteger, min: 0, initial: 0 })
    });
    schema.connections = new ArrayField(new StringField());
    schema.productMultiplier = new NumberField({ required: true, min: 0, initial: 0 });
    schema.laborers = new NumberField({ ...requiredInteger, min: 0, initial: 0 });
    schema.output = new NumberField({ ...requiredInteger, min: 0, initial: 0 });
    return schema;
  }
  prepareDerivedData() {
    const nodeType = LWFNODES.nodeType[this.nodeType.value];
    const nodeRichness = LWFNODES.richness[this.richness.value];
    const product = LWFNODES.developmentProduct[this.development.product.value];
    this.nodeType.name = nodeType.name;
    this.richness.name = nodeRichness.name;
    this.development.product.name = product.name;
    let factoryMult = 10;
    const devLevel = LWFNODES.developmentLevel[this.development.level.value];
    this.development.level.name = devLevel.name;
    let specificToggle = false;
    if(this.development.level.value > 0){
      this.development.cost = this.laborers;
      factoryMult = (product[devLevel.name] * 10);
      if(this.development.product.value > 0 && this.development.product.name !== 'Power'){
        specificToggle = true;
      }
    }
    else {
      this.development.cost = 0;
    }
    let nodeMult;
    if(specificToggle){
      nodeMult = 1000;  
    }
    else {
      nodeMult = ((nodeType.multiply * 100) * (nodeRichness.multiply * 10));
    }
    const mult = nodeMult * factoryMult;
    this.productMultiplier = mult / 10000;
    this.output = Math.floor((mult * this.laborers) / 10000);
  }
}