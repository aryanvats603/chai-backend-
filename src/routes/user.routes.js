import { Router } from "express";
import {loginUser, registerUser,logoutUser, refreshAccessToken } from "../controllers/user.controller.js";
import {upload}  from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router=Router(); //jse express ki app bnate thy

router.route("/register").post( upload.fields([{name:"avatar",maxCount:1},{name:"coverImage",maxCount:1}]), registerUser) // /register pe mai request handle kruga post type ki     //funcn eexcute se phle ek middleware lgado

router.route("/login").post(loginUser) 

//secured routes

router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh-token").post(refreshAccessToken)

export default router

