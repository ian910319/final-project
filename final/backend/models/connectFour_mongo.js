import mongoose from 'mongoose'
 
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  name: String,
  password: String,
  pictureURL: String
});

const ConnectFourSchema = new Schema({
  roomId: String,
  player1: { type: mongoose.Types.ObjectId, ref: "User" },
  player2: { type: mongoose.Types.ObjectId, ref: "User" },
  board:[[Number]]
});


const User = mongoose.model('User', UserSchema);
const ConnectFour = mongoose.model('ConnectFour', ConnectFourSchema)

export { User, ConnectFour };
