import express from "express"
import { login, logout, signup,updateProfile,checkAuth } from "../controller/auth.controller.js";
import { protectRoute } from "../middleware/auth.protectedRoute.js";

const router=express.Router();

router.post("/signup",signup);

router.post("/login",login)

router.post("/logout",logout)

router.put("/update-profile",protectRoute,updateProfile)

router.get("/check",protectRoute,checkAuth)

export default router;




// mongodb+srv://boorsunikhil2001_db_user:<db_password>@cluster0.ahl0oi2.mongodb.net/