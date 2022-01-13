import "./App.css"
import { useState } from 'react';
import SignIn from "./Containers/SignIn";
import GameBoard from './Containers/GameBoard'
import ConnectFour from "./Containers/ConnectFour";
import SixNimmt from "./Containers/SixNimmt";
import useSixNimmt from "./Hooks/useSixNimmt";

function App() {

  const [collapsed, setCollapsed] = useState(false)
  const [isConnectFour, setIsConnectFour] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  const [me, setMe] = useState('')
  const [isSixNimmt, setIsSixNimmt] = useState(false)
  const [photoURL, setPhotoURL] = useState('')
  const { sendLicensingCard, isgamestart, setIsgamestart,
          selfCards, cards, sendCompare, players, addSixNimmtPlayer } = useSixNimmt(setIsSixNimmt);


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
    />
    : isConnectFour
    ? <ConnectFour
      setIsConnectFour = {setIsConnectFour}
      me = {me}
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
    />
    : <GameBoard
      collapsed = {collapsed}
      setIsConnectFour = {setIsConnectFour}
      setIsSixNimmt = {setIsSixNimmt}
      toggle = {toggle}
      me = {me}
      photoURL = {photoURL}
      setPhotoURL = {setPhotoURL}
      players = {players}
      addSixNimmtPlayer = {addSixNimmtPlayer}
    />
    
    }
    </>
  );
}

export default App;
