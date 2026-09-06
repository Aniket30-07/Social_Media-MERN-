import express from 'express'
import {getUser, loginUser, registerUser} from '../controllers/user.controllers.js'
import isAuthenticated from '../middlewares/authMiddleware.js'

const userRoutes = express.Router()


//Register User
userRoutes.post('/register', registerUser)
//Login User
userRoutes.post('/login',loginUser)
userRoutes.get('/me', isAuthenticated , getUser)


export default userRoutes