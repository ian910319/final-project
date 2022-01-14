import {useState} from "react";

const client = new WebSocket('ws://localhost:4000')

const sendData = async (data) => {
  await client.send(
    JSON.stringify(data)
  );  
}

const useSixNimmt = () => {
  const [isgamestart, setIsgamestart] = useState(false); 
  const [selfCards, setSelfCards] = useState([]);
  const [cards, setCards] = useState([[]]);
  const [players, setPlayers] = useState([]);
  const [penaltyList, setPenaltyList] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState();
  const [chosenList, setChosenList] = useState([]);


  const addSixNimmtPlayer = (payload) => {
    sendData(["addSixNimmtPlayer", payload])  
  }
  
  const sendLicensingCard = (payload) => {
    sendData(["start", payload])                // start game
  }

  const sendCompare = (payload) => {
    sendData(["compare", payload]);
  }

  const sendLogIn = (payload) => {
    sendData(["login", payload]);
  }

  client.onmessage = (byteString) => {
    const {data} = byteString;
    const [task, payload] = JSON.parse(data);
    switch (task) {
      case "playeradd": {
        const [players_name] = payload;
        setPlayers(() => players_name);
        break ;
      }

      case "givePhotos": {
        setPhotos(() => payload);
        break ;
      }

      case "chosenCardDisplay": {
        setChosenList(() => payload);
        break ;
      }

      case "dispensecards": {
        const [cardsGet, initialcards] = payload;
        setSelfCards(cardsGet);
        setCards(() => [
          [initialcards[0], null, null, null, null, null],
          [initialcards[1], null, null, null, null, null],
          [initialcards[2], null, null, null, null, null],
          [initialcards[3], null, null, null, null, null],
        ]);
        break;
      }

      case "gamestarts" : {
        const [pp] = payload
        setPlayers(pp);
        setIsgamestart(true);
        break;
      }

      case "judgefinish": {
        setCards(() => payload);
        break;
      }

      case "penaltyupdate": {
        setPenaltyList(() => payload);
        break ;
      }

      case "myhandupdate": {
        setSelfCards(() => payload);
        break ;
      }

      case "gameover": {
        const [winner] = payload;
        setWinner(winner);
        setGameOver(true);
        break ;
      }

      default: break;
    }
 }

  return {
    sendLicensingCard,
    setIsgamestart,
    isgamestart,
    selfCards,
    cards,
    sendCompare,
    setPlayers,
    players,
    addSixNimmtPlayer,
    penaltyList,
    gameOver,
    setGameOver,
    winner,
    photos,
    sendLogIn,
    chosenList,
    setChosenList, 
  }
};

export default useSixNimmt;