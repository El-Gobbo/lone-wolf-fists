import lwfItemBase from "./base-item.mjs";

export default class lwfSkill extends lwfItemBase {
    static defineSchema() {
        const { HTMLField } = foundry.data.fields;
        const schema = super.defineSchema();
    
        schema.effectChart = new HTMLField();
    
        return schema;
      }

}