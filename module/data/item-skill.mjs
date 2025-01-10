import lwfItemBase from "./base-item.mjs";

export default class lwfSkill extends lwfItemBase {
    static defineSchema() {
        const { HTMLField, StringField } = foundry.data.fields;
        const schema = super.defineSchema();
        
        schema.use = new HTMLField({initial: ""});
        schema.effectChart = new HTMLField();
        schema.skill = new StringField();
    
        return schema;
      }

}