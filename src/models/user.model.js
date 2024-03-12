import mongoose,{Schema} from "mongoose"; //destructure the schema property of mongoose
import jwt from "jsonwebtoken";//jwt is a bearer token ,jo token bhejega usko data bhej do
import bcrypt from "bcrypt";


const userSchema = new Schema({
     username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index:true     //field ko searchable bnane k liye,optimised way--pr har jagah na lgana
    },
     email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        
    },
     fullname: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index:true
    },
     avatar: {
        type: String,  //cloudnary url
        required: true,
        
        
    },
     coverImage: {
        type: String,  //cloudnary url
        
        
        
    },
    watchHistory:[
        {
            type:Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    refreshToken: {
        type: String
    }

}

,{timestamps:true})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
    this.password = bcrypt.hash(this.password,10)
    next()
})  //pre will help datasave hone se phle kch run krado
//and arrow funcn ni use krege kyuki uske pas this ka ref ni hota
//encrption mai time lgta hai toh async
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}  //custom method can be made using mongoose

userSchema.methods.generateAccessToken = function(){ //token generation
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id: this._id
    },
    process.env.RERESH_TOKEN_SECRET,
    {
        expiresIn: process.env.RERESH_TOKEN_EXPIRY
    }
    )
}
export const User = mongoose.model("User", userSchema)  //mongodb mai "users" dikhayega