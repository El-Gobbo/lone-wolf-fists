export async function chakraReset(actor) {
    const maxAura = actor.system?.aura?.max;
    const minChakra = actor.system?.chakras?.lvl;
    const basePranaGen = (actor.system?.pool.lvl * minChakra) + actor.system.prana.gen.bonus;
    if(!(maxAura === undefined || minChakra === undefined))
        actor.update({ ["system.aura.value"]: maxAura, [ 'system.prana.value']: basePranaGen, [ 'system.chakras.value' ]: minChakra })
}