export async function chakraReset(actor) {
    const maxAura = actor.system?.aura?.max;
    const minChakra = actor.system?.chakras?.value;
    const basePranaGen = actor.system?.pool?.value * minChakra;
    if(!(maxAura === undefined || minChakra === undefined))
        actor.update({ ["system.aura.current"]: maxAura, [ 'system.prana.current']: basePranaGen, [ 'system.chakras.active' ]: minChakra })
}