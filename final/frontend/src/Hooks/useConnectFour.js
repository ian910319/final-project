import { useState } from "react";
const client = new WebSocket('ws://localhost:4000')
const sendData = (data) => {
  client.send(JSON.stringify(data));
};
const useConnectFour = () => {
  const [player, setPlayer] = useState([]);
  const [status, setStatus] = useState({});
  const [roomId, setRoomId] = useState('');
  const [me, setMe] = useState()
  const playConnectFour = (payload) => { 
    setMe(payload.player)
    sendData(["ConnectFour", payload]);
  }
  const leaveConnectFour = (payload) => { sendData(["LeaveConnectFour", payload])}
  
  client.onmessage = (byteString) => {
    const { data } = byteString;
    const [task, payload] = JSON.parse(data);
    switch (task) {
      case "Enter": {
        setPlayer(() => payload.list)
        setRoomId(() => {
          const temp = payload.list.filter((e)=>{
            return e.name === me;
          })
          console.log(temp)
          if(temp[0])
            return temp[0].roomId;
          else return ''
        })
        setStatus({type: 'Clear',
        msg: 'You Entered the room.'})
        break;
      }
      case "status": {
        if(payload.name===me)
          setStatus(() => payload); 
        break;
      }
      case "Leave": {
        setPlayer(() => payload.list)
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
    setStatus,
    playConnectFour,
    leaveConnectFour
 };
};

export default useConnectFour;
 