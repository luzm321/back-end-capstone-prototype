import {addCharacter, deleteAllCardsInSession, getAllCardsInSession, getMarvelCharacter, deleteSessionCard, getRandomMarvelCharacters, deleteCharacter} from './apiManager/apiManager.js';
import {Arena} from './components/Arena/Arena.js';
import { useEffect, useState } from 'react';

const App = () => {

  const [character, setCharacter] = useState("");
  const [characterInfo, setCharacterInfo] = useState([]);
  const [isGameOn, setGame] = useState(false);

  //useEffect(() => {}, []);


  const handleSetCharacter = (event) => {
    setCharacter(event.target.value);
  }

  const getCharacter = () => {
    getMarvelCharacter(character).then((data) => {
      setCharacterInfo(data);
    })
  }

  //User needs to log in so userId can be set in sessionStorage as the api fetch calls to retrieve the user's characters requires to know which characters are from which user:
  const logIn = () => {
    sessionStorage.setItem("userId", 1);
  }

  const logOut = () => {
    sessionStorage.clear();
  }

  const addCharacterToDatabase = () => {
    //constructing character object to save to db:
    let newCharacter = {
      "userId": parseInt(sessionStorage.getItem("userId")),
      //from server.js file in proxy server, the data for the character description obtained from the Marvel Comic API being returned when getting a character
      // is the second object (index of 1) from the array being retrieved as a response while all other data comes from the SuperHero Search API which is the first thing
      //returned from the same array as a response to the query:
      "description": characterInfo[1].data.results[0].description, //from Marvel Comics API, second object in character info array
      "name": characterInfo[0].name, // from SuperHero Search API, first object in character info array, just like other properties below:
      //owerstats is an array returned in the response from the fetch call to the SuperHero search that contains the four properties below among others:
      "strength": characterInfo[0].powerstats.strength,
      "speed": characterInfo[0].powerstats.speed,
      "power": characterInfo[0].powerstats.power,
      "health": 200
    }
    console.log('new character', newCharacter);
    addCharacter(newCharacter);
  }

  const checkState = () => {
    console.log('character state', character);
    console.log('character info state', characterInfo)
  }

  const startGame = () => {
    setGame(true);
  }

  const selectRandomCharacterForNPC = () => {
    getRandomMarvelCharacters().then((randomCharacters) => {
      //randomizing character selection for NPC:
      let randomIndex = Math.floor(Math.random() * randomCharacters.length);
      let newCharacter = {
        "userId": 0,
        "description": "",
        "name": randomCharacters[randomIndex].name,
        "strength": randomCharacters[randomIndex].powerstats.strength,
        "speed": randomCharacters[randomIndex].powerstats.speed,
        "power": randomCharacters[randomIndex].powerstats.power,
        "health": 200
      }
      addCharacter(newCharacter).then(() => {
        startGame();
      });
    });
  }

  const handleStartGame = () => {
      selectRandomCharacterForNPC();
  }

  const closeGame = () => {
    setGame(false);
    getAllCardsInSession().then((sessionCardsArray) => {
      console.log('session cards array', sessionCardsArray);
      //if there is a card in the sessionCardsArray, delete the character card from the session to remove the copies of cards in the 
      //actual hand to delete cards that are in the battleSession array for both user and npc, but not delete the actual cards owned by
      // the user, just the copy to clear the session:
      if (sessionCardsArray.length > 1) {
        if (sessionCardsArray[1].length !== 0) {
          deleteCharacter(sessionCardsArray[1].id);
        }
      } else {
        deleteAllCardsInSession(sessionCardsArray); // else, if there are no cards in the session array, then clear the session from all cards
      }
    });
  }


  return (
    <div className="App">
      {
      isGameOn ?
      <Arena closeGame={closeGame} setGame={setGame}/>
      :
      <>
        <button onClick={() => logIn()}>Log In</button>
        <button onClick={() => logOut()}>Log Out</button>
        <input onChange={(event) => handleSetCharacter(event)} placeholder="Character Name"></input>
        <button onClick={() => getCharacter()}>Get Marvel Character</button>
        <button onClick={() => addCharacterToDatabase()}>Add Character</button>
        <button onClick={() => checkState()}>Check State</button>
        {
          characterInfo.length === 0 ? <p>No Character Yet</p> :
          <>
          <p>{characterInfo[0].name}</p>
          <p>{characterInfo[1].data.results[0].description}</p>
          </>
        }
        <button onClick={() => {handleStartGame()}}>PLAY!</button>
       </>
      }

    </div>
  );
}

export default App;
