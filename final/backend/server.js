import express from 'express'
import mongoose from 'mongoose'
import router from './routes/router'
import cors from 'cors'
import http from 'http'
import WebSocket from 'ws'
import {User, ConnectFour} from './Model'
import {sendData, sendStatus} from './wssConnect'

require('dotenv').config()
mongoose
  .connect(process.env.MONGO_URL, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then((res) => console.log("mongo db connection created"))

const app = express()
app.use(express.json())
app.use(cors())
app.use('/api', router)

const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`),
);

const server = http.createServer();
server.listen(4000, () => console.log("Listening.. on 4000"))

const wss = new WebSocket.Server({
  server
});

///////////////////////////////////////////////////////////////////
/////////////// THIS IS FOR CONNECTFOUR ///////////////////////////
const broadcastPlayer = (data) => {
  wss.clients.forEach((client) => {
    sendData(data, client);
  });
};

const broadcastStatus = (status) => {
  wss.clients.forEach((client) => {
    sendStatus(status, client);
  });
};
///////////////////////////////////////////////////////////////////

wss.on('connection', (ws) => {
  ws.onmessage = async (byteString) => {
    
    const { data } = byteString
    const [task, payload] = JSON.parse(data)
    switch (task) {
      case 'ConnectFour': {
        const { roomId, player } = payload
        const existing = await ConnectFour.findOne({ roomId });
        if (existing){ 
          if(existing.player1){
            if(existing.player2){
              broadcastStatus({
                type: 'Full',
                msg: 'The room is full.'
              })
              console.log("full")
            }
            else{
              existing.player2 = await User.findOne({ name: player });
              const newPayload = {roomId: roomId, name: player, pictureURL: existing.player2.pictureURL}
              broadcastPlayer(['Enter',[newPayload]])
              broadcastStatus({
                type: 'Success',
                msg: `${player} entered the room ${roomId}`
              })
              console.log("player2")
              console.log(newPayload)
              return existing.save();
            }
          }
          else{
            existing.player1 = await User.findOne({ name: player });
            const newPayload = {roomId: roomId, name: player, pictureURL: existing.player1.pictureURL}
            broadcastPlayer(['Enter',[newPayload]])
            broadcastStatus({
              type: 'Success',
              msg: `${player} entered the room ${roomId}`
            })
            console.log("player1")
            console.log(newPayload)
            return existing.save();
          }
        }
        else{
          try {
            const newplayer = await User.findOne({ name: player });
            const newBoard = [
              [0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0],
              [0, 0, 0, 0, 0, 0, 0],
            ]
            const newConnectFour = new ConnectFour({ roomId, player1: newplayer, board: newBoard});
            const newPayload = {roomId: roomId, name: player, pictureURL: newplayer.pictureURL}
            broadcastPlayer(['Enter',[newPayload]])
            broadcastStatus({
              type: 'Success',
              msg: `${player} entered the room ${roomId}`
            })
            console.log("newroom")
            console.log(newPayload)
            return newConnectFour.save();
          } catch (e) { throw new Error("User creation error: " + e); }
        }
        break
      }
      case 'LeaveConnectFour': {
        const { name } = payload
        console.log(name)
        const existing = await User.findOne({ name: name });
        console.log(existing)
        const find1 = await ConnectFour.findOne({ player1: existing });
        const find2 = await ConnectFour.findOne({ player2: existing });
        console.log(find1)
        console.log(find2)
        if(find1){
          find1.player1 = null
          if(!find1.player2){
            await ConnectFour.deleteOne(find1)
          }
        }
        if(find2){
          find2.player2 = null
          if(!find2.player1){
            await ConnectFour.deleteOne(find2)
          }
          console.log(find2)
        }
        break
      }
      default: break
    }
  }    
})
