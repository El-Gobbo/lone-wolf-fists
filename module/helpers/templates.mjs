/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
  return loadTemplates([
    // Actor partials.
    'systems/lone-wolf-fists/templates/actor/parts/actor-imbalances.hbs',
    'systems/lone-wolf-fists/templates/actor/parts/actor-items.hbs',
    'systems/lone-wolf-fists/templates/actor/parts/actor-dharma.hbs',
    'systems/lone-wolf-fists/templates/actor/parts/actor-effects.hbs',
    // Item partials
    'systems/lone-wolf-fists/templates/item/parts/item-effects.hbs',
    'systems/lone-wolf-fists/templates/item/parts/item-dharma.hbs',
  ]);
};
