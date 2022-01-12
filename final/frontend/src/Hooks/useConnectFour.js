import { useState } from "react";
const client = new WebSocket('ws://localhost:4000')
const sendData = (data) => {
  client.send(JSON.stringify(data));
};
const useConnectFour = () => {
  const [player, setPlayer] = useState([]);
  const [status, setStatus] = useState({});
  const [roomId, setRoomId] = useState('')
  const playConnectFour = (payload) => { sendData(["ConnectFour", payload]);}
  
  client.onmessage = (byteString) => {
    const { data } = byteString;
    const [task, payload] = JSON.parse(data); 
    switch (task) {
      case "Enter": {
        setPlayer(() => [...player, ...payload])
        setRoomId(() => payload[0].roomId)
        console.log(player)
        //console.log(roomId)
        break;
      }
      case "status": {
        setStatus(() => payload); 
        //console.log(status)
        break;
      }
      default: 
        break;
    }
  }

  return {
    player,
    status,
    roomId,
    playConnectFour
 };
};

export default useConnectFour;
