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
          const maxAura = combatant.system?.aura?.max;
          const minChakra = combatant.system?.chakras?.value;
          const basePranaGen = combatant.system?.pool?.value * minChakra;
          if(!(maxAura === undefined || minChakra === undefined))
            combatant.update({ ["system.aura.current"]: maxAura, [ 'system.prana.current']: basePranaGen, [ 'system.chakras.active' ]: minChakra })
        }
        this.delete();
      }
    });
  }
}
