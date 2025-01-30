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

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
  }

  /**
   * @override
   * Augment the actor source data with additional dynamic data that isn't 
   * handled by the actor's DataModel. Data calculated in this step should be
   * available both inside and outside of character sheets (such as if an actor
   * is queried and has a roll executed directly from it).
   */
  prepareDerivedData() {

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
