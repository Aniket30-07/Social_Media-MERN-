//This middleware's job is to check the cookie -->
//Inside the cookie it should extract the token -->
// Check the token with the jwt_Secret and if that particular token is created with that secret then -->
// Get the userId

import jwt from 'jsonwebtoken'
import User from '../models/user.model.js'

const isAuthenticated = async (req, res,next) =>{
    try {
        const token = req.cookies.token

        if(!token){
            return res.status(404).json({message : "No token Found !"})
        }

        const decoded = jwt.verify(token, process.env.jwt_secret)
        //console.log(decoded) //--> This gives an obj having userId, initiatedat, expires at
        const user = await User.findById(decoded.userId)
       // console.log(user) //--> This gives the complete user data

       if(!user){
            return res.status(404).json({message : "User not Found !"})
       }

       req.user = user
       next()

    }
    
    catch (error) {
        return res.status(500).json({message : "Internal Server Error !"})
    }
}

export default isAuthenticated