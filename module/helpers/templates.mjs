/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
  return foundry.applications.handlebars.loadTemplates([
    // Actor partials.
    'systems/lone-wolf-fists/templates/actor/parts/actor-imbalances.hbs',
    'systems/lone-wolf-fists/templates/actor/parts/actor-optImbalances.hbs',
    'systems/lone-wolf-fists/templates/actor/parts/actor-techniques.hbs',
    'systems/lone-wolf-fists/templates/actor/parts/actor-chakras.hbs',
    'systems/lone-wolf-fists/templates/actor/parts/actor-abilities.hbs',
    'systems/lone-wolf-fists/templates/actor/parts/actor-items.hbs',
    'systems/lone-wolf-fists/templates/actor/parts/actor-equipment.hbs',
    'systems/lone-wolf-fists/templates/actor/parts/actor-dharma.hbs',
    'systems/lone-wolf-fists/templates/actor/parts/actor-effects.hbs',
    'systems/lone-wolf-fists/templates/actor/parts/actor-config.hbs',
    'systems/lone-wolf-fists/templates/actor/parts/actor-followers.hbs',

    // Item partials
    'systems/lone-wolf-fists/templates/item/parts/item-effects.hbs',
    'systems/lone-wolf-fists/templates/item/parts/item-dharma.hbs',
  ]);
};
