// import mongoose from "mongoose"
import connectDB from "./db/index.js"
//dotenv is for jitni jldi hmari app load ho utne mai env variables har jagah available hojaye
// require('dotenv').config({path:'./env'}) consistency kharab

import dotenv from "dotenv"

dotenv.config({
    path:'./.env'
})
connectDB()

/*import  express  from "express";

const app = express();
import { DB_NAME } from "./constants";
(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI} / ${DB_NAME}`);

        app.on("error", (error)=>{
            console.log("Error",error)
        })
        app.listen(process.env.PORT,()=>{
            console.log(`App listening on port ${process.env.PORT}`);
        })
    } catch (error) {
         console.log("ERROR: ", error);
         throw err
    }
})()*/