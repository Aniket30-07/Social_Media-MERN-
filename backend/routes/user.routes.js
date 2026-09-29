import express from 'express'
import { getUser, loginUser, registerUser, logoutUser, getUserProfile } from '../controllers/user.controllers.js'
import isAuthenticated from '../middlewares/authMiddleware.js'

const userRoutes = express.Router()


//Register User
userRoutes.post('/register', registerUser)

//Login User
userRoutes.post('/login', loginUser)

//For Autherizaation through middlewares --> Through tokens
userRoutes.get('/me', isAuthenticated, getUser)

//Logout User
userRoutes.post('/logout', logoutUser)

//Profile
userRoutes.get('/profile/:username', isAuthenticated, getUserProfile)

//Followers and Followings
userRoutes.post("/:id/follow", isAuthenticated, followUser);
userRoutes.delete("/:id/follow", isAuthenticated, unfollowUser);

export default userRoutes