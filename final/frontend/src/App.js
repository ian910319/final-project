import "./App.css"
import { useState } from 'react';
import GameBoard from './Containers/GameBoard'
import ConnectFour from "./Containers/ConnectFour";

function App() {

  const [collapsed, setCollapsed] = useState(false)
  const [isConnectFour, setIsConnectFour] = useState(false)
  // const [isSixNimmt, setIsSixNimmt] = useState(false)

  const toggle = () => {
    const now = !collapsed
    setCollapsed(now)
  };

  return (
    <>
    {isConnectFour ? 
    <ConnectFour
    setIsConnectFour = {setIsConnectFour}
    >
    </ConnectFour>
    :
    <GameBoard
      collapsed = {collapsed}
      setIsConnectFour = {setIsConnectFour}
      toggle = {toggle}
    >
    </GameBoard>
    }
    </>
  );
}

export default App;
