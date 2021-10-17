import { deleteSessionCard, editCardInSession, getSessionNPCHand, deleteCharacter } from "../apiManager/apiManager";


// method handles the attack functionality of game and which player attacks first based on character speed:
//currently, only user is able to attack, need to update algorithm for npc to attack after the user attacks and vice versa
export const attackAction = (setTurn, boolValue, userHand, npcHand, setUserHand, setNPCHand, setTrigger) => {
  console.log("hands", npcHand, userHand);
  if (boolValue) {
    // user attacks first
    console.log('user character outsped npc character');
    if (npcHand[0].health < 1) { //need to fix bug as currently user needs to click attack button again to end game and display winner when opposing character's health is down to zero...
      console.log('game ended, you win');
      deleteSessionCard(npcHand[0].id); //remove card from session
      deleteCharacter(npcHand[0].id); // delete character from npc hand
      setNPCHand([]); // reset NPC hand to empty array
    } else {
      let cardToChange = npcHand[0];
      let newHealthValue = npcHand[0].health - userHand[0].power; //update health points of npc and subtract user's character's power from npc's character's health
      cardToChange.health = newHealthValue;
      npcHand[0] = cardToChange;
      console.log('new hand', npcHand);
      editCardInSession(cardToChange, cardToChange.id).then(() => { //patch method in apiManager to update health points
        getSessionNPCHand().then((newNPCHand) => {
          setNPCHand(newNPCHand); //update state of npc's hand of cards
        })
      })
    }
  } else { // if npc's character is faster that user's character:
    // npc attacks first
    console.log('npc character outsped user character');
    if (userHand[0].health < 1) {
      console.log('game ended, you lose');
      deleteSessionCard(userHand[0].id);
      setUserHand([]);
    } else {
      userHand[0].health = userHand[0].health - npcHand[0].power;
      console.log('new user hand', userHand);
      setUserHand(userHand);
      // setTrigger(true);
    }
  }
}


export const turnEnds = () => {

}


export const decideWhoStarts = (userHand, npcHand, setGame) => {
  console.log('who starts', userHand, userHand.length, npcHand, npcHand.length);

  if (userHand.length === 0 || npcHand.length === 0) {
    // game ends
    console.log('Game Ends', npcHand, userHand);
  } else {
    if (userHand[0].speed > npcHand[0].speed) {
      return true;
    } else {
      return false;
    }
  }
};