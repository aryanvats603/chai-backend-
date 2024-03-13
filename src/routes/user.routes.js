import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";


const router=Router(); //jse express ki app bnate thy

router.route("/register").post(registerUser) // /register pe mai request handle kruga post type ki

export default router

