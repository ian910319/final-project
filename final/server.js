import express from 'express'
import mongoose from 'mongoose'
import router from './backend/routes/router.js'
import cors from 'cors' 
import http from 'http'
import { WebSocketServer } from 'ws'
import dotenv from "dotenv-defaults"
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

import {User, ConnectFour} from './backend/models/connectFour_mongo.js'
import {sendData, sendStatus} from './backend/wssConnect.js'
import {licensingcard} from "./backend/uitility/sixNimmt_utilities.js"
import {checkForWin} from "./backend/uitility/connectFour_utilities.js"
import {SixNimmtRoom, PlayerInfo} from "./backend/models/sixNimmt_mongo.js"

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

const __dirname = dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT || 5000;

const app = express()
app.use(express.json())
app.use(cors())
app.use('/api', router)
app.use(express.static(path.join(__dirname, "build")));
app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`),
);

const server = http.createServer(app);
server.listen(4000, () => console.log("Listening.. on 4000"))

const wss = new WebSocketServer({
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

const broadcastSingleNimmt = (data, filter) => {
  wss.clients.forEach((client) => {
    //console.log(client.name)
    //console.log("haha")
    if (client.name === filter) {
      //console.log("qqq");
      //console.log(client)
      sendData(data, client);
      
    }
  });
};

var wsIndex = [];
var comparecards = [];
var connectFourPlayers = []
///////////////////////////////////////////////////////////////////
 
wss.on('connection', (ws) => {
  ws.onmessage = async (byteString) => {
    const { data } = byteString
    const [task, payload] = JSON.parse(data)
    
    switch (task) {
      case "login": {
        const { user } = payload;
        ws.name = user;
        //console.log(ws);
        wsIndex.push({"user": user, "link": ws});
        //console.log(wsIndex);
        break;
      }

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

/************************************ below are for six nimmt **********************************/
      case "checkSixNimmtRoom": {
        console.log(payload)
        const {roomname, me} = payload;
        console.log(roomname, me);
        const existRoom = await SixNimmtRoom.findOne({roomname: roomname});
        if (!existRoom) {
          //console.log("here");
          await new SixNimmtRoom({roomname: roomname, players: [me]}).save();
          await new PlayerInfo({user: me, penalty: 0}).save();
          //console.log(me)
          sendData(["newSixNimmtRoom", {roomname, me}], ws);

        } else {
          if (existRoom.players.length === 10) sendData(["sixNimmtRoomFull"], ws);
          else if (existRoom.status === true)  sendData(["sixNimmtRoomPlaying"], ws);
          else {
            const existPlayer = await PlayerInfo.findOne({user: me});
            if (!existPlayer) await new PlayerInfo({user: me, penalty: 0}).save();
            const oldPlayers = existRoom.players;
            existRoom.players = [...oldPlayers, me];
            await existRoom.save();
            sendData(["sixNimmtRoomLobby", roomname], ws);
            existRoom.players.map((item) => {
              {broadcastSingleNimmt(["playeradd", existRoom.players], item)}
              console.log(item, existRoom.players);
            });
          }
        }
        break ;
      }

      case "leaveSixNimmtRoom": {
        const {roomname, me} = payload;
        const existRoom = await SixNimmtRoom.findOne({roomname: roomname});
        if (existRoom.length === 1) {
          await SixNimmtRoom.deleteOne({roomname: roomname});
        } else {
          const newPlayerList = existRoom.players.filter((item) => {return item !== me});
          existRoom.players = newPlayerList;
          await existRoom.save();
          existRoom.players.map((item) => broadcastSingleNimmt(["someoneLeave", existRoom.players], item));
        }
        break ;
      }

      case "addSixNimmtPlayer": {
        const { room, user } = payload;
        const exist = await PlayerInfo.findOne({user: user});
        if (!exist) {
          await new PlayerInfo({user: user, penalty: 0}).save();
        } else {throw new Error ("Player already exists!")}
        const existRoom = await SixNimmtRoom.findOne({roomname: room});
        if (existRoom) {
          const oldplayers = existRoom.players;
          existRoom.players = [...oldplayers, user];
          await existRoom.save();
          existRoom.players.map((item) => broadcastSingleNimmt(["playeradd", existRoom.players], item));
        } else {throw new Error ("room not found!")}
        break ;
      }

      case "start" : {
        const { room, number, six_players } = payload;
        var photos = [];
        var ihatedebug = [];
        const existRoom = await SixNimmtRoom.findOne({roomname: room});
        
        for (var i = 0; i < existRoom.players.length; i++) {                  // send players' picture
          const uu = await User.findOne({name: existRoom.players[i]});
          photos[i] = uu.pictureURL;
          PlayerInfo.updateOne({user: existRoom.players[i]}, {penalty: 0});
        }
        existRoom.status = true;
        await existRoom.save();
        //existRoom.players.map((item) => broadcastSingleNimmt(["givePhotos", photos], item));
        const allcards = licensingcard(number);                         // number is player number
        console.log(allcards);
        await SixNimmtRoom.updateOne({"roomname": room}, {"allcards": allcards})
        for (var i = 0; i < 4; i++) ihatedebug[i] = [allcards[number * 10 + i], null, null, null, null, null];
        await SixNimmtRoom.updateOne({"roomname": room}, {"cardboard": ihatedebug})
        for (i = 0; i < existRoom.players.length; i++) {
          var j;
          var cardsGet = allcards.slice(i * 10, i * 10 + 10);
          var initialcards = allcards.slice(allcards.length - 4, allcards.length);
          const payload = [cardsGet, initialcards];
          await PlayerInfo.updateOne({user: existRoom.players[i]}, {"cards": cardsGet});
          for (j = 0; wsIndex[j].user !== existRoom.players[i]; j++);
          broadcastSingleNimmt(["dispensecards", payload], existRoom.players[i])
        }
        existRoom.players.map((item) => {
          broadcastSingleNimmt(["gamestarts", existRoom.players], item)
          broadcastSingleNimmt(["givePhotos", photos], item);
        });
        break ;
      }

      case "compare" : {
        const {player, card, number, room} = payload;                             // number is player number
        var p = 0;
        for ( ; p < comparecards.length && comparecards[p].player !== player; p++);
        comparecards[p] = {player, card};
        //***************** all player draw cards******************//
        if (comparecards.length === number) {                                      // get all chosen cards
          var sorted = comparecards.sort(({card: a}, {card: b}) => a - b);        // sort in increasing order
          //console.log(comparecards)
          const existRoom = await SixNimmtRoom.findOne({roomname: room});

          //******* put cards into rows*******/
          var j = 0;
          while (j !== sorted.length) {
            var num = sorted[j].card;                                             // card number
            var chosenCardDisplay = [];
            for (var i = 0; i < existRoom.players.length; i++) {
              for (var k = 0; k < comparecards.length && comparecards[k].player !== existRoom.players[i]; k++);
              chosenCardDisplay[i] = comparecards[k].card;
            }
            existRoom.players.map((item) => {broadcastSingleNimmt(["chosenCardDisplay", chosenCardDisplay], item)});
            if (existRoom) {                                                       // search which row to insert
              var tobecomp = [];
              for (var i = 0; i < 4; i++) {
                for (var k = 0; existRoom.cardboard[i][k] !== null; k++);
                tobecomp[i] = existRoom.cardboard[i][k - 1];   // get the four last cards
              }
              var min = 101, min_idx;                                              // compare where to put
              for (var i = 0; i < 4; i++) {
                if (num - tobecomp[i] > 0 && num - tobecomp[i] <= min) {
                  min = num - tobecomp[i];
                  min_idx = i;
                }
              }  
              if (min !== 101) {                                                   // can put in
                var newrow = existRoom.cardboard[min_idx];
                var newboard = existRoom.cardboard;
                for (var i = 0; newrow[i] !== null; i++);
                newrow[i] = num;
                newboard[min_idx] = newrow;
                await SixNimmtRoom.updateOne({roomname: room}, {$set: {"cardboard": newboard}})
                if (newboard[min_idx][5] !== null)  {                                // check penalty or not
                  var penalty = 0;
                  var penaltyList = [];
                  for (var i = 0; i < 5; i++) {
                    if (newrow[i] % 10 === 0)       penalty += 3;
                    else if (newrow[i] === 55)      penalty += 7;
                    else if (newrow[i] % 11 === 0)  penalty += 5;
                    else if (newrow[i] % 5 === 0)   penalty += 2;
                    else                              penalty += 1;
                  }
                  const oldpenalty = await PlayerInfo.findOne({user: sorted[j].player}, {penalty: 1});
                  await PlayerInfo.updateOne({user: sorted[j].player}, {penalty: oldpenalty.penalty + penalty});  
                  
                  for (var i = 0; i < existRoom.players.length; i++) {
                    var temp = await PlayerInfo.findOne({user: existRoom.players[i]})
                    penaltyList[i] = temp.penalty;
                  }
                  existRoom.players.map((item) => {broadcastSingleNimmt(["penaltyupdate", penaltyList], item)});
                  newboard[min_idx] = [num, null, null, null, null, null];
                  await SixNimmtRoom.updateOne({roomname: room}, {$set: {"cardboard": newboard}})
                }
                
              } else { // the new card is too small to put, so renew first row
                var newboard = existRoom.cardboard;
                newboard[0] = [num, null, null, null, null, null];
                await SixNimmtRoom.updateOne({roomname: room}, {"cardboard": newboard});
              }
              for (var i = 0; i < comparecards.length; i++) {                                                // renew everyone's cards
                const cardsHave = await PlayerInfo.findOne({user: comparecards[i].player});
                const newCardsHave = cardsHave.cards.filter((item) => {return item !== comparecards[i].card});
                cardsHave.cards = newCardsHave;
                await cardsHave.save();
                broadcastSingleNimmt(["myhandupdate", newCardsHave], comparecards[i].player);                // send message to client to renew my hand
              }
              j++;
            } else {throw new Error ("Roomname not exisst!")}
          }
          existRoom.players.map((item) => broadcastSingleNimmt(["judgefinish", existRoom.cardboard], item))
          const havecards = await PlayerInfo.findOne({"user": comparecards[0].player})            
          if (havecards.cards.length === 0) {                     // if no cards, game over
            //console.log("here");
            const winner = await PlayerInfo.findOne().sort({penalty: 1}).limit(1);
            console.log(winner.user);
            existRoom.status = false;
            existRoom.players.map((item) => broadcastSingleNimmt(["gameover", winner.user], item));
          }
          comparecards = [];// clear cards to be compare
        } else                                               
        break ;
      }

      default: break
    }
  }
  ws.onclose = () => {}
})
