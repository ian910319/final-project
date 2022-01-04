import express from 'express'
import mongoose from 'mongoose'
import router from './routes/route'
import cors from 'cors'

require('dotenv').config()
mongoose
  .connect(process.env.MONGO_URL, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then((res) => console.log("mongo db connection created"))

const app = express()
app.use(express.json())
app.use(cors())
app.use('/api', router)

const port = process.env.PORT || 5000;
app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`),
);
