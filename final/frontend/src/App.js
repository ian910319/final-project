import "./App.css"
import { useState } from 'react';
import SignIn from "./Containers/SignIn";
import GameBoard from './Containers/GameBoard'
import ConnectFour from "./Containers/ConnectFour";
import SixNimmt from "./Containers/SixNimmt";
import useConnectFour from "./Hooks/useConnectFour";
import useSixNimmt from "./Hooks/useSixNimmt";

function App() {

  const [collapsed, setCollapsed] = useState(false)
  const [isConnectFour, setIsConnectFour] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  const [me, setMe] = useState('')
  
  const [photoURL, setPhotoURL] = useState('')
  const {player, status, roomId, playConnectFour, leaveConnectFour} = useConnectFour()
  const { sendLicensingCard, isgamestart, setIsgamestart,
          selfCards, cards, sendCompare, players, addSixNimmtPlayer,
          penaltyList, gameOver, setGameOver, winner, photos, sendLogIn,
          chosenList, sendCheckSixNimmtRoom, roomname, setIsSixNimmt,
          isSixNimmt, sendLeaveRoom,} = useSixNimmt();
  
  const toggle = () => {
    const now = !collapsed
    setCollapsed(now)
  };
  return (
    <>
    {
    !signedIn
    ? <SignIn
      me = {me}
      setMe = {setMe} 
      setSignedIn = {setSignedIn}
      setPhotoURL = {setPhotoURL}
      sendLogIn = {sendLogIn}
    />
    : isConnectFour
    ? <ConnectFour
      setIsConnectFour = {setIsConnectFour}
      player = {player}
      roomId = {roomId}
      leaveConnectFour = {leaveConnectFour}
      me={me}
    />
    : isSixNimmt
    ? <SixNimmt 
      setIsSixNimmt = {setIsSixNimmt}
      me = {me}
      sendLicensingCard = {sendLicensingCard}
      isgamestart = {isgamestart}
      setIsgamestart = {setIsgamestart}
      selfCards = {selfCards}
      cards = {cards}
      sendCompare = {sendCompare}
      players = {players}
      penaltyList = {penaltyList}
      gameOver = {gameOver}
      setGameOver = {setGameOver}
      winner = {winner}
      photos = {photos}
      chosenList = {chosenList}
      roomname = {roomname}
      sendCheckSixNimmtRoom = {sendCheckSixNimmtRoom}
      sendLeaveRoom = {sendLeaveRoom}
    />
    : <GameBoard
      collapsed = {collapsed}
      setIsConnectFour = {setIsConnectFour}
      setIsSixNimmt = {setIsSixNimmt}
      toggle = {toggle}
      me = {me}
      photoURL = {photoURL}
      setPhotoURL = {setPhotoURL}
      playConnectFour = {playConnectFour}
      players = {players}
      addSixNimmtPlayer = {addSixNimmtPlayer}
      sendCheckSixNimmtRoom = {sendCheckSixNimmtRoom}
    />
    
    }
    </>
  );
}

export default App;
