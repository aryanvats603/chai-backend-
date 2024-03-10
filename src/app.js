import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
const app = express();


app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
                            //app.use is for middleware and configurations

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true , limit:"16kb"}))  
app.use(express.static("public"))
app.use(cookieParser())              //crud operations on cookies for website and server can also put secure cookies on user web            



export {app}