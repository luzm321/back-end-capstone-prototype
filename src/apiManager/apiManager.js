import {hashKey, generateTimestamp} from "./hashHelper.js";

let baseUrl = ""

// gets marvel character data from both APIs and does fetch call to proxy that sends request to both APIs:
export const getMarvelCharacter = (characterName) => {
  console.log('hello');
  let publicKey = "8f26faf3d251d1c35383404a75368f3a";
  let privateKey = "adbf4771abaedb731f7057c28146782337b6b1b1";
  let hash = hashKey(publicKey, privateKey);

  const query = `&characterName=${characterName}&publicKey=${publicKey}&hash=${hash}`
  return fetch(`http://localhost:8000/api/getCharacter?${query}`)
  .then((data) => {
    return data.json()
  })
};

// gets top 20 random characters (heroes or villains) from SuperHero Search API:
export const getRandomMarvelCharacters = () => {
  return fetch(`http://localhost:8000/api/getRandomCharacters`)
  .then((data) => {
    return data.json()
  })
};

// add character to db.json server
export const addCharacter = (body) => {
  return fetch(`http://localhost:3000/characters`, {
    "method": "POST",
    "headers": {
      "Content-Type": "application/json"
    },
    "body": JSON.stringify(body)
  });
};


// delete character from db.json server
export const deleteCharacter = (cardId) => {
  return fetch(`http://localhost:3000/characters/${cardId}`, {
    "method": "DELETE"
  });
}

// retrieves characters from db.json server that belong to the user:
export const getUserHand = () => {
  return fetch(`http://localhost:3000/characters`)
  .then((data) => {
    return data.json();
  })
  .then((allCharacters) => {
    return allCharacters.filter((character) => {
      if (character.userId === parseInt(sessionStorage.getItem("userId"))) {
        console.log('user characters', character);
        return character;
      }
    })
  })
};

// retrieves characters from db.json that belong to the npc:
export const getNPCHand = () => {
  return fetch(`http://localhost:3000/characters`)
  .then((data) => {
    return data.json();
  })
  .then((allCharacters) => {
    return allCharacters.filter((character) => {
      if (character.userId === 0) {
        console.log('npc character found', character.name);
        return character;
      }
    })
  })
};

// adds user's and npc's hand to the battleSession array in db.json
export const addHandToSession = (handArray) => {
  for(let i = 0; i < handArray.length; i++) {
    return fetch(`http://localhost:3000/battleSession`, {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json"
      },
      "body": JSON.stringify(handArray[i])
    });
  }
};

// retrieves user's hand of cards in the battleSession:
export const getSessionUserHand = () => {
  return fetch(`http://localhost:3000/battleSession`)
  .then((data) => {
    return data.json();
  })
  .then((allCharacters) => {
    return allCharacters.filter((character) => {
      if (character.userId === parseInt(sessionStorage.getItem("userId"))) {
        return character;
      }
    })
  })
};

// retrieves npc's hand of cards from the battleSession:
export const getSessionNPCHand = () => {
  return fetch(`http://localhost:3000/battleSession`)
  .then((data) => {
    return data.json();
  })
  .then((allCharacters) => {
    return allCharacters.filter((character) => {
      if (character.userId === 0) {
        return character;
      }
    })
  })
};

// deletes a card from the battleSession when a character is defeated (health point reduced to zero)
export const deleteSessionCard = (cardId) => {
  console.log('url', `http://localhost:3000/battleSession/${cardId}`);
  fetch(`http://localhost:3000/battleSession/${cardId}`, {
    method: "DELETE"
  });
};

// retrieves all cards in the session both belonging to user and npc:
export const getAllCardsInSession = () => {
  return fetch(`http://localhost:3000/battleSession`)
  .then((data) => {
    return data.json();
  })
};

// deletes all cards in the battleSession to clear the session and user can start a new game:
export const deleteAllCardsInSession = (sessionCardsArray) => {
  for (let i = 0; i < sessionCardsArray.length; i++) {
    console.log('battleSession', sessionCardsArray[i].id);
    fetch(`http://localhost:3000/battleSession/${sessionCardsArray[i].id}`, {
    "method": "DELETE"
  });
  }
}

// retrieves user and npc hands of cards, adds both to the battleSession, retrieves both user/npc hands from session and returns cards in session:
export const handleCardsInSession = () => {
  return getUserHand()
  .then((hand) => {
    console.log('hand', hand);
    return addHandToSession(hand)
    .then(() => {
      return getSessionUserHand()
      .then((sessionUserHand) => {
        return getNPCHand().then((npcH) => {
          console.log('npc hand', npcH);
          return addHandToSession(npcH).then(() => {
            return getSessionNPCHand().then((sessionNPCHand) => {
              console.log('session npc hand', sessionNPCHand);
              return [sessionUserHand, sessionNPCHand];
            });
          });
        });
      });
    });
  });
};

// patches a card in the battleSession so that user/npc's character health points are modified during the game each round:
export const editCardInSession = (body, cardId) => {
  return fetch(`http://localhost:3000/battleSession/${cardId}`, {
      "method": "PATCH",
      "headers": {
        "Content-Type": "application/json"
      },
      "body": JSON.stringify(body)
    });
};

// export const getMusic = () => {
//   return fetch(`http://localhost:8000/api/getMusic`).then((data) => {
//     return data.json()
//   });
// };