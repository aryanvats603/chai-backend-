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

//routes import
import userRouter from './routes/user.routes.js'

//routes declaration
//phle directly app.get yhi likhre thy..bcoz routes bhi yhi likhre t and controller bhi but ab routes kahi aur se larhe hai so for this use middleware..router ko lane k liye

app.use("/api/v1/users",userRouter)  //control passes to userRouter jse hi api/v1/users hit hua

//http://localhost:8000/api/v1/users/register




export {app}