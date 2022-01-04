import mongoose from 'mongoose'
 
const Schema = mongoose.Schema;
const UserSchema = new Schema({
  name: String,
  pictureURL: String
});
const User = mongoose.model('User', UserSchema);

export default User;
