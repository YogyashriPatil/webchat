import jwt from "jsonwebtoken";
export const generateToken=(userID,res) =>
    {
        const token=jwt.sign({userID},process.env.JWT_SECRET,{
        expiresIn:"30d",
    });
    //send JWT cookies
    res.cookie("jwt",token,{
        maxAge:30*24*60*60*1000, //MS
        httpOnly:true, //pdsa revent XSS attacks cross-site scripting attacks
        sameSite:"strict",
        secure:process.env.NODE_ENV!=="development" ,
    });
    return token;
};