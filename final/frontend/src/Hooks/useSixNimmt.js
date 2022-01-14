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


  const addSixNimmtPlayer = (payload) => {
    //console.log("here1");
    sendData(["addSixNimmtPlayer", payload])  
  }
  
  const sendLicensingCard = (payload) => {
   // console.log("here2");
    //console.log(payload)
    sendData(["start", payload])                // start game
  }

  const sendCompare = (payload) => {
    //console.log("sendCompare:", payload);
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
        //console.log(players_name);
        setPlayers(players_name);
        break ;
      }

      case "givePhotos": {
        setPhotos(payload);
        break ;
      }

      case "dispensecards": {
        //console.log("here3");
        //console.log(payload)
        const [cardsGet, initialcards] = payload;
        //console.log(cardsGet)
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
        setSelfCards(payload);
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
    }

};

export default useSixNimmt;
