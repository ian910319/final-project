import express from 'express'
import { User } from '../models/connectFour_mongo.js'
import mongoose from 'mongoose';
import bcrypt from 'bcrypt'

const router = express.Router()

const db = mongoose.connection;
db.on("error", (err) => console.log(err));

let Payload
let login = false
let photoURL
const findUser = async (name, password) => {
  const existing = await User.findOne({ name });
  if (!existing){ 
    let msg = "User doesn't exist!"
    let status = "Old"
    Payload = {msg, status}
    login = false
    photoURL = ""
    return
  }
  else{
    try {
      let hash = bcrypt.compareSync(password, existing.password)
      if(!hash){
        Payload = {msg: "Wrong password!", status: "Old"}
        login = false
        photoURL = ""
        return
      }
      else{
        let msg = `${name}, welcome!`
        let status = "New"
        Payload = {msg, status}
        login = true
        photoURL = existing.pictureURL
        return
      }
    } catch (e) { throw new Error("User creation error: " + e); }
  }
};

let payload
router.get('/find-user', async(req, res) => {
  try{
    await findUser(req.query.me, req.query.password)
    res.send({payload: Payload, login, photoURL})
  } catch(e) {res.status(404)}
})

const saveUser = async (name, password) => {
    const existing = await User.findOne({ name });
    if (existing){ 
      let msg = `User ${name} already exists.`
      let status = "Old"
      payload = {msg, status}
      return
    }
    else{
      try {
        ///////encrypt

        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        var hash = bcrypt.hashSync(password, salt);
        password = hash;

        ///////
        const newUser = new User({ name, password, pictureURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRE95qPiotkOo4A7GdJm_bDsIZtT0BQxqmwTg&usqp=CAU" });
        //console.log("hi")
        newUser.save();
        let msg = "New user is created."
        let status = "New"
        payload = {msg, status}
        return
      } catch (e) { throw new Error("User creation error: " + e); }
    }
};

router.post('/create-user', async(req, res) => {
    try{
      await saveUser(req.body.me, req.body.password)
      res.send({payload})
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