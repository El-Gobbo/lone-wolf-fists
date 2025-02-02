/**
 * Extend the base Combatant document by defining a custom initiative calculation.
 * @extends {Combatant}
 */
export class lwfCombatant extends Combatant {
  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  getInitiativeRoll(){
    let dice;
    const rollData = this.actor?.getRollData() || {};
    if(rollData.initiative.advantage === true)
      dice = "2d10k";
    else
      dice = "1d10";
    let formula = dice.concat(rollData.initiative.modifiers);
    return Roll.create(formula, rollData);
  }
}
