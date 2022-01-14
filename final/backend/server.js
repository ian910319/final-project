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
    //console.log(client)
    sendData(data, client);
    sendStatus(status, client);
  });
};

const broadcastSingleNimmt = (data, filter) => {
  wss.clients.forEach((client) => {
    console.log(client.name)
    if (client.name === filter) {
      console.log("fuck");
      console.log(client)
      sendData(data, client);
      
    }
  });
};

var wsIndex = [];
var comparecards = [];
var id = 0;
///////////////////////////////////////////////////////////////////

wss.on('connection', (ws) => {
  ws.onmessage = async (byteString) => {
    const { data } = byteString
    const [task, payload] = JSON.parse(data)
    
    switch (task) {
      case "login": {
        const { user } = payload;
        ws.name = user;
        console.log(ws);
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
      case "addSixNimmtPlayer": {
        const { room, user } = payload;
        const exist = await PlayerInfo.findOne({user: user});
        if (!exist) {
          await new PlayerInfo({user: user}).save();
        }
        const existing = await SixNimmtRoom.findOne({roomname: room});
        if (existing) {
          const oldplayers = existing.players;
          //console.log(user);
          existing.players = [...oldplayers, user];
          await existing.save();
          //console.log(existing.players)
          broadcastMessage(["playeradd", [existing.players]], {
            type: "success", msg: "Player added."
          });
        } else {throw new Error ("room not found!")}
        break;
      }

      case "start" : {
        const { room, number, six_players } = payload;
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
          console.log(wsIndex[j].user);
          //console.log(wsIndex[j].link)
          console.log("hhhhhhhh");
         // broadcastMessage(["dispensecards", payload])
          broadcastSingleNimmt(["dispensecards", payload], six_players[i])
          //sendData(["dispensecards", payload], wsIndex[j].link)
          //wsIndex[j].link.send(JSON.stringify(["dispensecards", payload]))
          //sendData(["dispensecards", payload], wsIndex[j].link);
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
        for (var i = 0; i < comparecards.length && comparecards[i].player !== player; i++);
        //if (i === comparecards.length) comparecards[comparecards.length] = {player, card}
        //else                           comparecards[i].card = card;
        comparecards[i] = {player, card};

        //***************** all player draw cards******************//
        if (comparecards.length === number) {                                      // get all chosen cards
          var sorted = comparecards.sort(({card: a}, {card: b}) => a - b);        // sort in increasing order
          const existing = await SixNimmtRoom.findOne({roomname: room});
          //******* put cards into rows*******/
          while (sorted.length !== 0) {
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
                  const existplayer = await PlayerInfo.findOne({user: sorted[0].player});
                  await PlayerInfo.updateOne({user: sorted[0].player}, {"penalty": existplayer.penalty + penalty})
                  
                  const playerList = existroom.players;
                  var penaltyList = [];
                  for (var i = 0; i < playerList.length; i++) {                           // get new penalty list
                    const singleExistPlayer = await PlayerInfo.findOne({user: playerList[i]});
                    penaltyList[i] = singleExistPlayer.penalty;
                  }
                  broadcastMessage(["penaltyupdate", [penaltyList]], {
                    type: "success", msg: "Penalty updated."
                  })
                }
                
              } else { // the new card is too small to put, so renew first row
                var newboard = existing.cardboard;
                newboard[0] = [num, null, null, null, null, null, null];
                await SixNimmtRoom.updateOne({roomname: room}, {"cardboard": newboard});

              }                                                  
              const lala = await PlayerInfo.findOne({user: sorted[0].player});                   // renew this person's cards
              var lala_newcards = lala.cards.filter((item) => {return item !== sorted[0].card});
              lala.cards = lala_newcards;
              await lala.save();
              //console.log(lala.cards);
              sorted.splice(0, 1);
            } else {throw new Error ("Roomname not exisst!")}
          }
          broadcastMessage(["judgefinish", existing.cardboard], {
            type: "success", msg: "Judge finfished."
          })

          const havecards = await PlayerInfo.findOne({"user": comparecards[0].player})            
          if (havecards.cards.length === 0) {                     // if no cards, game over
            setTimeout(10000);
            const winner = await PlayerInfo.find().sort({penalty: 1}).limit(1);
            broadcastMessage(["gameover", [winner.player]], {
              type: "gameover", msg: "game finished"
            })
            await PlayerInfo.remove({});                                    // clear player information
            //await SixNimmtRoom.findOneAndRemove({roomname: room});
            await SixNimmtRoom.updateOne({roomname: room}, {player: []});

          }
        }
        comparecards = [];                                             // clear cards to be compare
        break;
      }
      default: break
    }
  }
})
