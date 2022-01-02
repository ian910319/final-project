import "./App.css"
import { useState } from 'react';
import SignIn from "./Containers/SignIn";
import GameBoard from './Containers/GameBoard'
import ConnectFour from "./Containers/ConnectFour";

function App() {

  const [collapsed, setCollapsed] = useState(false)
  const [isConnectFour, setIsConnectFour] = useState(false)
  const [signedIn, setSignedIn] = useState(false)
  const [me, setMe] = useState('')
  // const [isSixNimmt, setIsSixNimmt] = useState(false)

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
    />
    : isConnectFour
    ? <ConnectFour
    setIsConnectFour = {setIsConnectFour}
    me = {me}
    />
    : <GameBoard
      collapsed = {collapsed}
      setIsConnectFour = {setIsConnectFour}
      toggle = {toggle}
      me = {me}
    />
    }
    </>
  );
}

export default App;
