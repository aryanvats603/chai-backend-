// import mongoose from "mongoose"
import connectDB from "./db/index.js"
//dotenv is for jitni jldi hmari app load ho utne mai env variables har jagah available hojaye
// require('dotenv').config({path:'./env'}) consistency kharab

import dotenv from "dotenv"
import {app} from "./app.js"

dotenv.config({
    path:'./.env'
})
connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{console.log(`server is running at ${process.env.PORT}`);})
})
.catch((err)=>{
    console.log("mongodb connection failed",err);
})

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