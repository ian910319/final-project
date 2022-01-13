import express from 'express'
import dotenv from "dotenv-defaults"
import mongoose from "mongoose"
import { WebSocket } from 'ws'
import http from "http"
import cors from 'cors'
import {licensingcard, judgecards} from "./utilities"
import {initData, sendData, sendStatus} from './wssConnect'
import {SixNimmtRoom, PlayerInfo} from "./models/sixNimmt_mongo"


dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => console.log("mongo db connection created"))

const db = mongoose.connection
const app = express()
const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

app.use(cors());

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

db.once('open', () => {
  console.log('MongoDB connected!');
  wss.on('connection', (ws) => {
    
    ws.id = id++;
    lookup[ws.id] = ws;
    ws.onmessage = async (byteString) => {
      //await SixNimmtRoom.updateOne({"roomname": "test"}, {$set: {"players": []}});
      const {data} = byteString;
      const [task, payload] = JSON.parse(data);
      switch (task) {
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
        default: break;
      }
    }
  })
  const port = process.env.PORT || 4000;
  server.listen(port, () => {
    console.log(`Listening on http://localhost: ${port}.`)
  })
})