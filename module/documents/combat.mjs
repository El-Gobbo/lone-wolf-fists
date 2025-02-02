/**
 * Extend the base Combat document to allow for custom end of combat events.
 * @extends {Combat}
 */
export class lwfCombat extends Combat {
  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  async endCombat() {
    return Dialog.confirm({
      title: game.i18n.localize("COMBAT.EndTitle"),
      content: `<p>${game.i18n.localize("COMBAT.EndConfirmation")}</p>`,
      yes: async () => {
        const combatantList = this.combatants.map(c => c.actorId);
        for(let c in combatantList) {
          const combatant = await game.actors.get(combatantList[c]);
          const maxAura = combatant.system?.aura.max;
          if(!(maxAura === undefined))
            combatant.update({["system.aura.current"]: maxAura})
        }
        this.delete();
      }
    });
  }
}
