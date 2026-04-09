import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // 1️⃣ Validate input
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must contain at least 6 characters",
      });
    }

    // 2️⃣ Check existing user
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // 3️⃣ Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4️⃣ Create & save user
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
    });

    // 5️⃣ Generate token
    generateToken(newUser._id, res);

    // 6️⃣ Send response (RETURN!)
    return res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });

  } catch (error) {
    console.error("Error in signup controller:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login=async(req,res)=>{
   const {email,password}=req.body;
   try {
        const user=await User.findOne({email});
        if(!user){
          return  res.status(400).json({message:"Invalid credentials"})
        }
        const isPasswordCorrect=await bcrypt.compare(password,user.password);
        if(!isPasswordCorrect){
          return  res.status(400).json({message:"Invalid credentials"})

        }
        generateToken(user._id,res);
       return res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic,
        })
   } catch (error) {
    console.log("Error inn login contriller",error);
    res.status(500).json({message:"Internal server error"})
   }
}
export const logout=async(req,res)=>{
   try {
       res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"Logged out successfully"})
       
} catch (error) {
       console.log("Error inn logout contriller",error);
    res.status(500).json({message:"Internal server error"})
} 
}

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user?._id;

    // 1️⃣ Validate
    if (!profilePic) {
      return res
        .status(400)
        .json({ message: "Profile picture is required" });
    }

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized" });
    }

    // 2️⃣ Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    // 3️⃣ Update user in DB
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    ).select("-password");

    // 4️⃣ Send response
    return res.status(200).json(updatedUser);

  } catch (error) {
    console.log("Error in updateProfile controller:", error);
    return res
      .status(500)
      .json({ message: "Internal server error" });
  }
};


export const checkAuth=(req,res)=>{
try {
     res.status(200).json(req.user)
} catch (error) {
     console.log("Error inn checkauth contriller",error);
    res.status(500).json({message:"Internal server error"})
}
}