import express from 'express'
import {getUser, loginUser, registerUser, logoutUser} from '../controllers/user.controllers.js'
import isAuthenticated from '../middlewares/authMiddleware.js'

const userRoutes = express.Router()


//Register User
userRoutes.post('/register', registerUser)

//Login User
userRoutes.post('/login',loginUser)

//For Autherizaation through middlewares --> Through tokens
userRoutes.get('/me', isAuthenticated , getUser)

//Logout User
userRoutes.post('/logout', logoutUser)


export default userRoutes