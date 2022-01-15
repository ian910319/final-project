import express from 'express'
import mongoose from 'mongoose'
import router from './routes/router'
import cors from 'cors' 
import http from 'http'
import WebSocket from 'ws'
import {User, ConnectFour} from './models/connectFour_mongo'
import {sendData, sendStatus, initData} from './wssConnect'
import dotenv from "dotenv-defaults"
import {licensingcard, judgecards} from "./uitility/sixNimmt_utilities"
import {checkForWin} from "./uitility/connectFour_utilities"
import {SixNimmtRoom, PlayerInfo} from "./models/sixNimmt_mongo"


dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(async() => {
    console.log("mongo db connection created")
    try {
      await ConnectFour.deleteMany({});
    } catch (e) { throw new Error("Database deletion failed"); }
  })

const db = mongoose.connection
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
/////////////// THIS IS FOR UTILITY ///////////////////////////
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

const broadcastMessage = (data, status) => {
  wss.clients.forEach((client) => {
    sendData(data, client);
    sendStatus(status, client);
  });
};

var i;
var id = 0;
var lookup = {};
var comparecards = [];
var connectFourPlayers = []
///////////////////////////////////////////////////////////////////
 
wss.on('connection', (ws) => {
  ws.onmessage = async (byteString) => {
    
    ws.id = id++;
    lookup[ws.id] = ws;
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
                msg: 'The room is full.',
                name: player
              })
              console.log("full") 
            } 
            else{
              existing.player2 = await User.findOne({ name: player });
              const newPayload = {roomId: roomId, name: player, pictureURL: existing.player2.pictureURL}
              connectFourPlayers.push(newPayload)
              broadcastPlayer(['Enter',{list: connectFourPlayers}])
              broadcastStatus({
                type: 'Success',
                msg: `${player} entered the room ${roomId}`
              })
              console.log("player2")
              //console.log(newPayload)
              return existing.save();
            }
          }
          else{
            existing.player1 = await User.findOne({ name: player });
            const newPayload = {roomId: roomId, name: player, pictureURL: existing.player1.pictureURL}
            connectFourPlayers.push(newPayload)
            broadcastPlayer(['Enter',{list: connectFourPlayers}])
            broadcastStatus({
              type: 'Success',
              msg: `${player} entered the room ${roomId}`
            })
            console.log("player1")
            //console.log(newPayload)
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
            connectFourPlayers.push(newPayload)
            broadcastPlayer(['Enter',{list: connectFourPlayers}])
            broadcastStatus({
              type: 'Success',
              msg: `${player} entered the room ${roomId}`
            })
            console.log("newroom")
            //console.log(newPayload)
            return newConnectFour.save();
          } catch (e) { throw new Error("User creation error: " + e); }
        }
        break
      }
      case 'LeaveConnectFour': {
        const { name } = payload
        connectFourPlayers = connectFourPlayers.filter((e)=>{
          return e.name !== name
        })
        //console.log(name)
        const existing = await User.findOne({ name: name });
        //console.log(existing)
        const find1 = await ConnectFour.findOne({ player1: existing });
        const find2 = await ConnectFour.findOne({ player2: existing });
        //console.log(find1)
        //console.log(find2)
        const newBoard = [
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
        ]
        broadcastPlayer(['Leave',{list: connectFourPlayers}])
        if(find1){
          find1.player1 = null
          find1.board = newBoard
          find1.markModified('board');
          find1.save()
        }
        if(find2){
          find2.player2 = null
          find2.board = newBoard
          find2.markModified('board');
          find2.save()
        }
        break
      }
      case 'Play': {
        const { roomId, name, column } = payload
        const existing = await ConnectFour.findOne({ roomId });
        const player = await User.findOne({ name });
        const one = existing.player1.toString()
        const two = existing.player2.toString()
        const playerID = player._id.toString()
        
        let chess = 0
        if(one === playerID) chess = 1
        if(two === playerID) chess = 2
        for (let row = 5; row >= 0; row--) { 
          if (!existing.board[row][column]) {
            existing.board[row][column] = chess
            break
          } 
        } 
        broadcastPlayer(['Move',{board: existing.board, roomId}])
        let gameOver = checkForWin(existing.board)
        if(gameOver){
          broadcastPlayer(['GameOver',{result: gameOver, roomId}])
        }
        existing.markModified('board');
        existing.save() 
        
        break;
      }
      case 'Restart': {
        const { roomId } = payload
        const existing = await ConnectFour.findOne({ roomId });
        const newBoard = [
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
          [0, 0, 0, 0, 0, 0, 0],
        ]
        existing.board = newBoard
        existing.markModified('board');
        broadcastPlayer(['Restart',{board: existing.board, roomId}])
        existing.save()
        break;
      }
/////////////////////////////////////////////////////
//////////////////// FOR 6NIMMT /////////////////////
/////////////////////////////////////////////////////
      case "addSixNimmtPlayer": {
        const { room, user } = payload;
        const existing = await SixNimmtRoom.findOne({roomname: room});
        if (existing) {
          const oldplayers = existing.players;
          //console.log(user);
          existing.players = [...oldplayers, user];
          existing.save();
          //console.log(existing.players)
          broadcastMessage(["playeradd", [existing.players]], {
            type: "success", msg: "Player added."
          });
        } else {throw new Error ("room not found!")}
        break;
      }

      case "start" : {
        const { room, number } = payload;
        const allcards = licensingcard(number);                         // number is player number
        console.log(allcards);
        var ihatedebug = [];
        await SixNimmtRoom.updateOne({"roomname": room}, {$set: {"allcards": allcards}})
        for (var i = 0; i < 4; i++) ihatedebug[i] = [allcards[number * 10 + i], null, null, null, null, null];
        await SixNimmtRoom.updateOne({"roomname": room}, {$set: {"cardboard": ihatedebug}})
        for (i = 0; i < id; i++) {
          var cardsget = allcards.slice(i * 10, i * 10 + 10);
          var initialcards = allcards.slice(allcards.length - 4, allcards.length);
          const payload = [cardsget, initialcards];
          sendData(["dispensecards", payload], lookup[i]);
        }
        const existing = await SixNimmtRoom.findOne({roomname: room});
        const players_name = existing.players;
        
        broadcastMessage(["gamestarts", [players_name]], {
          type: "success", msg: "Cards dlicensed."
        })
        break;
      }
      case "compare" : {
        const {player, card, number, room} = payload;                             // number is player number
        comparecards[comparecards.length] = {player, card}
        if (comparecards.length === number) {                                          // get all chosen cards
          var sorted = comparecards.sort(({card: a}, {card: b}) => a - b);        // sort in increasing order
          var j = 0;
          const existing = await SixNimmtRoom.findOne({roomname: room});
          while (j !== number) {
            var num = sorted[0].card;                                             // card number              
            if (existing) {                                                       // search which row to insert
              var tobecomp = [];
              for (var i = 0; i < 4; i++) {
                for (var k = 0; existing.cardboard[i][k] !== null; k++);
                tobecomp[i] = existing.cardboard[i][k - 1];   // get the four last cards
              }
              var min = 101, min_idx;                                              // compare where to put
              for (var i = 0; i < 4; i++) {
                if (num - tobecomp[i] > 0 && num - tobecomp[i] <= min) {
                  min = num - tobecomp[i];
                  min_idx = i;
                }
              }  
              if (min !== 101) {                                                   // can put in
                var newrow = existing.cardboard[min_idx];
                for (var i = 0; newrow[i] !== null; i++);
                newrow[i] = num;
                var newboard = existing.cardboard;
                newboard[min_idx] = newrow;
                await SixNimmtRoom.updateOne({roomname: room}, {$set: {"cardboard": newboard}})
                if (newboard[min_idx][5] !== null)  {                                // check penalty or not
                  const rowclear = existing.cardboard[min_idx];
                  var penalty = 0;
                  for (var i = 0; i < 5; i++) {
                    if (rowclear[i] % 10 === 0)       penalty += 3;
                    else if (rowclear[i] === 55)      penalty += 7;
                    else if (rowclear[i] % 11 === 0)  penalty += 5;
                    else if (rowclear[i] % 5 === 0)   penalty += 2;
                    else                              penalty += 1;
                  }
                }
                sorted.splice(0, 1);
              }  
              j++;
            } else {throw new Error ("Roomname not exisst!")}
          }
          broadcastMessage(["judgefinish", existing.cardboard], {
            type: "success", msg: "Judge finfished."
          })
          comparecards = [];
        }
        break;
      }
      default: break
    }
  }    
})
