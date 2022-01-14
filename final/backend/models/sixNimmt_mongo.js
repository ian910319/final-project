import  mongoose from "mongoose";

const Schema = mongoose.Schema;

const sixNimmtRoomSchema = new Schema ({
    roomname: String,
    players: [String],
    allcards: [Number],
    cardboard: [[Number], [Number], [Number], [Number]],
})

const playerInfoSchema = new Schema ({
    user: String,
    cards: [Number],
    panelty: Number,
})

const SixNimmtRoom = mongoose.model('sixNimmtRoom', sixNimmtRoomSchema);
const PlayerInfo = mongoose.model('playerInfo', playerInfoSchema);

export {SixNimmtRoom, PlayerInfo};