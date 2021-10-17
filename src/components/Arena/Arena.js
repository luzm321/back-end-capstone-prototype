import { useEffect, useState } from 'react';
import { attackAction, decideWhoStarts } from '../../actions/AttackAction';
import { addHandToSession, getNPCHand, getSessionUserHand, getSessionNPCHand, getUserHand, handleCardsInSession } from '../../apiManager/apiManager';

export const Arena = ({closeGame, setGame}) => {

  const [userHand, setUserHand] = useState([]);
  const [npcHand, setNPCHand] = useState([]);
  // const [currentTurnHand, setCurrentTurnHand] = useState([]);
  const [turn, setTurn] = useState();
  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    handleCardsInSession().then((cardsInSessionArray) => {
      console.log('array', cardsInSessionArray);
      setUserHand(cardsInSessionArray[0]);
      setNPCHand(cardsInSessionArray[1]);
    });
  }, [])

  const checkState = () => {
    console.log("user hand state", userHand);
    console.log("npc hand state", npcHand);
  }


  return (
      <>
        <h1>User Hand</h1>
        <button onClick={() => {checkState()}}>check state</button>
        {
          userHand.map((card) => {
            return <>
                <p>Character Name: {card.name}</p>
                <p>Health: {card.health}</p>
                <p>Power: {card.power}</p>
                <p>Speed: {card.speed}</p>
            </>
          })
        }

        {
          userHand.length === 0 ?
            <h1></h1> :
            npcHand.length === 0 ?
            <h1></h1> :
            decideWhoStarts(userHand, npcHand, setGame) ?
                <button onClick={() => {attackAction(setTurn, true, userHand, npcHand, setUserHand, setNPCHand, setTrigger)}}>Attack</button>
                :
                attackAction(setTurn, false, userHand, npcHand, setUserHand, setNPCHand, setTrigger)
        }

        <h1>NPC Hand</h1>
        {npcHand.length !== 0 ?
          npcHand.map((card) => {
            return <>
                <p>Character Name: {card.name}</p>
                <p>Health: {card.health}</p>
                <p>Power: {card.power}</p>
                <p>Speed: {card.speed}</p>
            </>
          })
        : <h1>NPC died, you win! :D</h1>
        }
        <button onClick={() => {closeGame()}}>Exit Game</button>
      </>
  )
}