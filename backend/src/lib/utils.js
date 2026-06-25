import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    //create a token that is generated from the api to show that the user is authenticated.
    const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
        expiresIn: "7d", // Token expires in 1 hour
    });
    //the token is sent to the user as a cookie
    res.cookie("jwt", token, { 
        httpOnly: true, //prevents XSS attacks
        secure: process.env.NODE_ENV === "development" ? false: true, //it secures by turning it to https 
        sameSite: "Strict", // Prevent CSRF attacks
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    });
    return token;
}