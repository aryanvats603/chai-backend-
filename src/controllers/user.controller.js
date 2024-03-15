import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
const registerUser = asyncHandler(async (req, res) => {
    // res.status(200).json({
    //     message:'ok'
    // })
    //get user details from frontend
    //validation-not empty
    //check if user already exits-email,username
    //check for images,check for avatar
    //upload them on cloudinary ,avatar
    //create user object - create entry in db
    //remove password  and refresh token  fields from response
    //check for user creation
    //resturn res

    const {fullName,email,username,password} = req.body
    console.log("Email: ",email)

    if([fullName,email,username,password].some((field)=> field?.trim() === "")){
        //if koi bhi field true return krega..means vo vala khali tha

        throw new ApiError(400,"All fileds are required")

    }
    
   const existedUser= await User.findOne({
       $or:[{username},{email}]
   })
    
    if(existedUser){
        throw new ApiError(409,"User already exists with the same username and email") 
    }
    //middleware req k andr aur fields add krdeta hai

   const avatarLocalPath= req.files?.avatar[0]?.path;
//multer se files ka access
 //const coverImageLocalPath = req.files?.coverImage[0]?.path;

 let coverImageLocalPath;
 if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
     coverImageLocalPath = req.files.coverImage[0].path
 }

if(!avatarLocalPath){
    throw new ApiError(400,"Avatar image is required")
}

const avatar=await uploadOnCloudinary(avatarLocalPath)
const coverImage=await uploadOnCloudinary(coverImageLocalPath)

if(!avatar){
    throw new ApiError(400,"AVatar image required")   
}

const user=await User.create({
    fullName,
    avatar:avatar.url,
    coverImage:coverImage.url || "",
    email,
    password,
    username:username.toLowerCase(),
})
//mongodb har ek entry k sath ek _id name ka field add krdeta hai
 const createdUser=await User.findById(user._id).select(
    "-password -refreshToken"  //ye krne se ye two fields select hoke ni aygi
 )
 if(!createdUser){
    throw new ApiError(500,"something went wrong while registering the user")
 }

 return res.status(201).json(new ApiResponse(200,createdUser,"User registered successfully"))
})


export {registerUser}