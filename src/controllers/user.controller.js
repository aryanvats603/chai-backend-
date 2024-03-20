import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken =  user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken   //user mai dal dia db mai save krdia
        await user.save({ validateBeforeSave: false })  //save krate time aur fields bhi kick hojate hai jse ki password field toh usko false krdo

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}
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



const loginUser= asyncHandler(async(req,res)=>{
    //req.body--->data
    //username or email
    //find the user
    //password check
    //access and refresh token generate krke user ko bhejo
    //send cookie
    //send res for success login

    const {email,username,password}=req.body

    if(!username && !email){
        throw new ApiError(400,"Username or email is required")
    }

    const user=await User.findOne({
        $or:[{username},{email}]
})
     if(!user){
        throw new ApiError(404,"User doesnt exist")
     }

   const isPasswordValid=  await user.isPasswordCorrect(password)
     
   if(!isPasswordValid){
    throw new ApiError(401,"Invalid user credentials")
 }


  const{accessToken, refreshToken}=await generateAccessAndRefreshTokens(user._id) 
//yhape bhi database ki chzein horhi hai time lg skta hai await lgado
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
  //user ko hme  password aur rt field ni chahie  
  const options = {
    httpOnly: true,//->sirf server se modify hopygi cookies after this    //options for cookies
    secure: true
}

return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

const logoutUser = asyncHandler(async(req, res)=>{
    //cookies clear krni pdegi
    //refresh token ko bhi htana pdega user se
    //middleware use krna pdega

    User.findByIdAndUpdate(
      await  req.user._id,
        {
            $set:{
                refreshToken: undefined,
            },
        },
            {
                new:true //ye krne se response mai reftok ki new value milegi
            }
        
    )
    const options = {
        httpOnly: true,//->sirf server se modify hopygi cookies after this    //options for cookies
        secure: true
    }
    return res
           .status(200)
           .clearCookie("accessToken",options)
           .clearCookie("refreshToken",options)
           .json(new ApiResponse(200,{},"User logged out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "unauthorized request")
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            throw new ApiError(401, "Invalid refresh token")
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used")
            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                {accessToken, refreshToken: newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }

})


export {registerUser,loginUser,logoutUser,refreshAccessToken}