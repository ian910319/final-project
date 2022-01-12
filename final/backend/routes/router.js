import express from 'express'
import { User } from '../Model'
import mongoose from 'mongoose';

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

export default router

