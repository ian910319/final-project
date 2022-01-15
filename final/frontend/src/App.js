import "./App.css"
import { useState, useEffect } from 'react';
import { message } from "antd";
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
  const [isSixNimmt, setIsSixNimmt] = useState(false)
  const [photoURL, setPhotoURL] = useState('')
  const {player, status, roomId, setStatus, playConnectFour, leaveConnectFour} = useConnectFour()
  const { sendLicensingCard, isgamestart, setIsgamestart,
          selfCards, cards, sendCompare, players, addSixNimmtPlayer } = useSixNimmt(setIsSixNimmt);


  const toggle = () => {
    const now = !collapsed
    setCollapsed(now)
  };
   const displayStatus = (payload) => {
    if (payload.msg) {
      const { type, msg } = payload
      const content = {
        content: msg, duration: 0.5 }
      switch (type) {
        case 'Full':
          message.error(content)
          break
        default:
          break
    }}}
  useEffect(() => {displayStatus(status)}, [status])

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
      player = {player}
      roomId = {roomId}
      leaveConnectFour = {leaveConnectFour}
      status={status}
      setStatus={setStatus}
      displayStatus={displayStatus}
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
    />
    
    }
    </>
  );
}

export default App;
