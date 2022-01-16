import bcrypt from "bcrypt"
import {User} from '../models/connectFour_mongo.js'

const initData = () =>{
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    var hash1 = bcrypt.hashSync("B09901099", salt);
    var password1 = hash1;
    var hash2 = bcrypt.hashSync("12345678", salt);
    var password2 = hash2;
    var hash3 = bcrypt.hashSync("00000000", salt);
    var password3 = hash3;
    const newUser1 = new User({name: "Ian", password: password1, pictureURL:"https://static.popdaily.com.tw/wp-content/uploads/2021/03/augwynzljvsok08ggk8g044o4qqiodt-1000x1000.jpeg"})
    newUser1.save()
    const newUser2 = new User({name: "John", password: password2, pictureURL:"https://lastfm.freetls.fastly.net/i/u/ar0/c3ecc3996c72f3a62105d028cb10781f"})
    newUser2.save()
    const newUser3 = new User({name: "Andy", password: password3, pictureURL:"https://japanstarinfo.com/wp-content/uploads/2021/10/1-58.png"})
    newUser3.save()
}

export default initData