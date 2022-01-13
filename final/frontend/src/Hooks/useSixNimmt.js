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

  const addSixNimmtPlayer = (payload) => {
    console.log("here1");
    sendData(["addSixNimmtPlayer", payload])  
  }
  
  const sendLicensingCard = (payload) => {
    console.log("here2");
    console.log(payload)
    sendData(["start", payload])                // start game
  }

  const sendCompare = (payload) => {
    console.log("sendCompare:", payload);
    sendData(["compare", payload]);
  }

  

  client.onmessage = (byteString) => {
    const {data} = byteString;
    const [task, payload] = JSON.parse(data);
    switch (task) {
      case "playeradd": {
        const [players_name] = payload;
        console.log(players_name);
        setPlayers(players_name);
        break ;
      }
      case "dispensecards": {
      //console.log(typeof(payload));
        const [cardsget, initialcards] = payload;
        setSelfCards(cardsget);
        setCards(() => [
          [initialcards[0], null, null, null, null, null],
          [initialcards[1], null, null, null, null, null],
          [initialcards[2], null, null, null, null, null],
          [initialcards[3], null, null, null, null, null],
        ]);
        break;
      }
      case "gamestarts" : {
        const [players_name] = payload;
        setPlayers([players_name])
        setIsgamestart(true);
        break;
      }
      case "judgefinish": {
        console.log(payload);
        const newboard = payload;
        setCards(() => newboard);
        break;

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
    }

};

export default useSixNimmt;
