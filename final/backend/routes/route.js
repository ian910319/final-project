import express from 'express'
import User from '../models/User'
import mongoose from 'mongoose';
import licensingcard from '../utilities';
import { sixNimmtRoom } from '../models/sixNimmt_mongo';

const router = express.Router()

const db = mongoose.connection;
db.on("error", (err) => console.log(err));
/*
db.once("open", async () => {
  
});
*/

let photoURL
const saveUser = async (name) => {
    const existing = await User.findOne({ name });
    if (existing){ 
      photoURL = existing.pictureURL
      return
    }
    else{
      try {
        const newUser = new User({ name, pictureURL: "error" });
        //console.log("hi")
        photoURL = newUser.pictureURL
        return newUser.save();
      } catch (e) { throw new Error("User creation error: " + e); }
    }
};

router.post('/create-user', async(req, res) => {
    try{
      await saveUser(req.body.me)
      res.send({URL: photoURL})
    } catch(e) {res.status(404)}
})

const savePhoto = async (name, picture) => {
    const existing = await User.findOne({ name });
    if (existing){ 
      existing.pictureURL = picture
      photoURL = picture
      return existing.save()
    }
    else{
      return
    }
};

router.post('/create-photo', async(req, res) => {
    try{
      await savePhoto(req.body.me, req.body.newPhoto)
      res.send({URL: photoURL})
    } catch(e) {res.status(404)}
})

router.post('/sixNimmt/licensingcard', async (req, res) => {
  try {
    const allcards = licensingcard(5);
    const existing = await sixNimmtRoom.findOne({roomname: req.body.roomname})
    
    if (existing) {
      existing.allcards = allcards;
      existing.save();
    } else {console.log("roomname not found")}
    console.log(existing);
  } catch (e) {res.status(404); console.log("lincense card error")}
})

router.post('/sixNimmt/judgecard', async (req, res) => {
  try {
    const chosencard = req.body.chosencard;
    judgecards();

  } catch (e) {res.status(404); console.log("judge card error")}
})




export default router