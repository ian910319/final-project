import express from 'express'
import mongoose from 'mongoose'
import router from './routes/router'
import cors from 'cors'
import http from 'http'
import WebSocket from 'ws'
import {User, ConnectFour} from './Model'
import {sendData, sendStatus} from './wssConnect'
import dotenv from "dotenv-defaults"
import {licensingcard} from "./utilities"
import {SixNimmtRoom, PlayerInfo} from "./models/sixNimmt_mongo"

dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log("mongo db connection created"))

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
            console.log(newplayer.pictureURL);
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

      case "checkSixNimmtRoom": {
        console.log(payload)
        const {roomname, me} = payload;
        console.log(roomname, me);
        const existRoom = await SixNimmtRoom.findOne({roomname: roomname});
        if (!existRoom) {
          //console.log("here");
          await new SixNimmtRoom({roomname: roomname, players: [me]}).save();
          //console.log(me)
          sendData(["newSixNimmtRoom", {roomname, me}], ws);

        } else {
          if (existRoom.players.length === 10) sendData(["sixNimmtRoomFull"], ws);
          else if (existRoom.status === true)  sendData(["sixNimmtRoomPlaying"], ws);
          else {
            const existPlayer = await PlayerInfo.findOne({user: me});
            if (!existPlayer) await new PlayerInfo({user: me, penalty: 0}).save();
            else              {throw new Error ("Player already exists!")}
            const oldPlayers = existRoom.players;
            existRoom.players = [...oldPlayers, me];
            await existRoom.save();
            sendData(["sixNimmtRoomLobby"], ws);
            existRoom.players.map((item) => {broadcastSingleNimmt["playeradd", existRoom.players], item});
          }
        }
        break ;
      }

      case "leaveSixNimmtRoom": {
        const {roomname, me} = payload;
        const existRoom = await SixNimmtRoom.findOne({roomname: roomname});
        const newPlayerList = existRoom.players.filter((item) => {return item !== me});
        existRoom.players = newPlayerList;
        existRoom.save();
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
          existRoom.players.map((item) => {broadcastSingleNimmt["playeradd", existRoom.players], item});
        } else {throw new Error ("room not found!")}
        break ;
      }

      case "start" : {
        const { room, number, six_players } = payload;
        var photos = [];
        const existRoom = await SixNimmtRoom.findOne({roomname: room});
        for (var i = 0; i < six_players.length; i++) {                  // send players' picture
          const uu = await User.findOne({name: six_players[i]});
          photos[i] = uu.pictureURL;
        }
        existRoom.players.map((item) => {broadcastSingleNimmt["givePhotos", photos], item});
        const allcards = licensingcard(number);                         // number is player number
        console.log(allcards);
        var ihatedebug = [];
        await SixNimmtRoom.updateOne({"roomname": room}, {"allcards": allcards})
        for (var i = 0; i < 4; i++) ihatedebug[i] = [allcards[number * 10 + i], null, null, null, null, null];
        await SixNimmtRoom.updateOne({"roomname": room}, {"cardboard": ihatedebug})
        for (i = 0; i < number; i++) {
          var cardsGet = allcards.slice(i * 10, i * 10 + 10);
          await PlayerInfo.updateOne({user: six_players[i]}, {"cards": cardsGet})
          var initialcards = allcards.slice(allcards.length - 4, allcards.length);
          const payload = [cardsGet, initialcards];
          for (var j = 0; wsIndex[j].user !== six_players[i]; j++);
          broadcastSingleNimmt(["dispensecards", payload], six_players[i])
        }
        existRoom.players.map((item) => {broadcastSingleNimmt(["gamestarts", existRoom.players])});
        break ;
      }


      case "compare" : {
        const {player, card, number, room} = payload;                             // number is player number
        for (var i = 0; i < comparecards.length && comparecards[i].player !== player; i++);
        comparecards[i] = {player, card};

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
                console.log(newboard[min_idx])
                if (newboard[min_idx][5] !== null)  {                                // check penalty or not
                  //const rowclear = existing.cardboard[min_idx];
                  //console.log("here");
                  var penalty = 0;
                  for (var i = 0; i < 5; i++) {
                    if (newrow[i] % 10 === 0)       penalty += 3;
                    else if (newrow[i] === 55)      penalty += 7;
                    else if (newrow[i] % 11 === 0)  penalty += 5;
                    else if (newrow[i] % 5 === 0)   penalty += 2;
                    else                              penalty += 1;
                  }
                  const oldpenalty = await PlayerInfo.findOne({user: sorted[j].player}, {penalty: 1});
                  await PlayerInfo.updateOne({user: sorted[j].player}, {penalty:oldpenalty.penalty + penalty});  
                  var penaltyList = [];
                  /*existRoom.players.map((item) => {                                    // get new penalty list
                    const temp = await PlayerInfo.findOne({user: item}, {penalty: 1});
                    penalty.push(temp.penalty);
                  })*/
                  for (var i = 0; i < existRoom.players.length; i++) {
                    var temp = await PlayerInfo.findOne({user: existRoom.players[i]})
                    penalty[i] = temp.penalty;
                  }
                  existRoom.players.map((item) => {broadcastSingleNimmt(["penaltyupdate", penaltyList], item)});
                  newboard[min_idx] = [num, null, null, null, null, null];
                  await SixNimmtRoom.updateOne({roomname: room}, {$set: {"cardboard": newboard}})
                }
                
              } else { // the new card is too small to put, so renew first row
                var newboard = existRoom.cardboard;
                newboard[0] = [num, null, null, null, null, null];
                //console.log(newboard);
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
          existRoom.players.map((item) => broadcastSingleNimmt(["judgefinish", existing.cardboard], item))
          /*broadcastMessage(["judgefinish", existing.cardboard], {
            type: "success", msg: "Judge finfished."
          })*/
          const havecards = await PlayerInfo.findOne({"user": comparecards[0].player})            
          if (havecards.cards.length === 0) {                     // if no cards, game over
            console.log("here");
            //setTimeout(console.log("Hello!"), 10000);
            const winner = await PlayerInfo.find().sort({penalty: 1}).limit(1);
            existRoom.players.map((item) => broadcastSingleNimmt(["gameover", winner.player], item))
            /*broadcastMessage(["gameover", [winner.player]], {
              type: "gameover", msg: "game finished"
            })*/
            await PlayerInfo.remove({});                                    // clear player information
            //await SixNimmtRoom.findOneAndRemove({roomname: room});
            await SixNimmtRoom.updateOne({roomname: room}, {player: []});
          }
          comparecards = [];// clear cards to be compare
        }                                                    
        break ;
      }
      default: break
    }
  }
})
