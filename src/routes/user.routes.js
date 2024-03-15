import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";
import {upload}  from "../middlewares/multer.middleware.js"

const router=Router(); //jse express ki app bnate thy

router.route("/register").post( upload.fields([{name:"avatar",maxCount:1},{name:"coverImage",maxCount:1}]), registerUser) // /register pe mai request handle kruga post type ki     //funcn eexcute se phle ek middleware lgado

export default router

