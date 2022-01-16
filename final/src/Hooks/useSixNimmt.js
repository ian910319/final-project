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
  const [roomname, setRoomname] = useState();
  const [isSixNimmt, setIsSixNimmt] = useState(false);

  const sendCheckSixNimmtRoom = (payload) => {
    //console.log(payload)
    sendData(["checkSixNimmtRoom", payload])
  }

  const sendLeaveRoom = (payload) => {
    console.log(payload);
    sendData(["leaveSixNimmtRoom", payload]);
  }

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
      case "newSixNimmtRoom": {
        const {roomname, me} = payload;
        setRoomname(() => roomname);
        setPlayers(() => [me]);
        setIsSixNimmt(() => true);
        break ;
      }

      case "sixNimmtRoomFull": {
        alert("Room is full, please search for other rooms or create a new one.");
        break ;
      }

      case "sixNimmtRoomPlaying": {
        alert("Room is playing, please wait or search others.");
        break ;
      }

      case "sixNimmtRoomLobby": {
        setIsSixNimmt(true);
        setRoomname(() => payload)
        break ;
      }

      case "someoneLeave": {
        setPlayers(() => payload);
        break ;
      }

      case "playeradd": {
        console.log(payload);
        setPlayers(() => payload);
        break ;
      }

      case "givePhotos": {
        //console.log(payload);
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
        break ;
      }

      case "gamestarts" : {
        setPlayers(payload);             // players
        setIsgamestart(true);
        break ;
      }

      case "judgefinish": {
        setCards(() => payload);
        break ;
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
        console.log(payload);
        setWinner(payload);
        setGameOver(true);
        break ;
      }

      default: break ;
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
    sendCheckSixNimmtRoom,
    roomname,
    setIsSixNimmt,
    isSixNimmt,
    sendLeaveRoom,
  }
};

export default useSixNimmt;