import express from 'express'
import { getUser, loginUser, registerUser, logoutUser, getUserProfile, followUser, unfollowUser } from '../controllers/user.controllers.js'
import isAuthenticated from '../middlewares/authMiddleware.js'
import upload from '../middlewares/upload.middleware.js'

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

//Middleware for multer
userRoutes.post('/testUpload', isAuthenticated, upload.single('profileImage'), testUpload)

export default userRoutes