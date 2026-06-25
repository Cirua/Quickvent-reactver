/*this are the controllers for the auth routes it
has the request and response objects that are used by
the website*/
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import { sendWelcomeEmail } from "../email/emailHandlers.js";
import "dotenv/config";

export const signup = async (req, res) => {
  const {email, password } = req.body;
  try{
    if(!email || !password){
        return res.status(400).json("Email and password are required");
  }
  if(password.length < 6){
    return res.status(400).json("Password must be at least 6 characters long");
}
     if (!/[a-z]/.test(password)) {
    return res.status(400).json("Password must contain at least one lowercase letter");
  }
  if (!/[A-Z]/.test(password)) {
    return res.status(400).json("Password must contain at least one uppercase letter");
  }
    if (!/\d/.test(password)) {
    return res.status(400).json("Password must contain at least one number");
  }
  
  const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
  if (!specialChars.test(password)) {
    return res.status(400).json("Password must contain at least one special character");
  }


    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json("Invalid email format");
    }


const user = await User.findOne({ where: { email } });
  if (user) {
    return res.status(400).json("Email already exists");
  }
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);

let newUser;
try {
  newUser = await User.create({ email, password: hashedPassword });
} catch (createError) {
  if (createError?.code === "23505") {
    return res.status(400).json("Email already exists");
  }
  throw createError;
}

if (newUser){
  generateToken(newUser.id, res);

    res.status(201).json({ message: "User created successfully", email:newUser.email });
}
else{
    res.status(400).json("Failed to create user");
}
try{
    await sendWelcomeEmail(newUser.email, process.env.CLIENT_URL); // Send welcome email

}catch (emailError) {
    console.error("Error sending welcome email:", emailError);
    // You can choose to ignore the email sending error or handle it differently    
}

} catch (error) {
    return res.status(500).json("Something went wrong");
  }
};