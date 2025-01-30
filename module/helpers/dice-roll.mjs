const SETLENGTH = 10;

export async function effortRoll(diceNumber, data) {
  // Roll the set number of dice
  const rolls = await new Roll(`${diceNumber}d10`).evaluate();

  // Get the raw dice results
  const rollResult = rolls.terms[0].results.map(roll => roll.result);

  // Sort them into groups based on their facing
  const counts = new Array(SETLENGTH).fill(0);
  rollResult.forEach(roll => {
    if(roll < SETLENGTH)
      counts[roll] += 1
    else
      counts[0] += 1
  });
  // Create an object with only the popuated sets present, in order
  const sets = [];
  counts.forEach((rank, facing) => {
    if(rank >= 1){
      let set = new Array(rank).fill(facing);
      sets.push(set)
    }
  });
  // Display these groups as a chat message

  data.content = await renderTemplate(`systems/lone-wolf-fists/templates/chat-messages/effort-roll.hbs`, { sets })
  data.rolls = rolls;
  data.flags = { core: { canPopout: true } };
  return ChatMessage.create(data, {})

}

export async function extractDiceNumber(message, data) {
  let command = message.split(" ");
  if(Number(command[1]) === NaN)
    //TODO: create proper error message, using htm in the command:
    // ui.notifications.error(html)
    return;
  
  await effortRoll(command[1], data)
  return null;
}