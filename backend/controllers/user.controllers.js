import { response } from "express"
import User from "../models/user.model.js"
import bcrypt from 'bcryptjs'
import genToken from "../utils/genToken.js"


const cookieOptions = {
    httpOnly: true,
    //We have to avoid XSS and CSRF attacks
}

//registration of user
export const registerUser = async (req, res) => {
    //
    const { name, username, email, password } = req.body

    //validations

    try {
        if (!name || !username || !email || !password) {
            return res.status(422).json({ message: 'All fields are required!' })
        }

        //chk if username exists
        const user = await User.findOne({ username })

        if (user) {
            return res.status(400).json({ message: 'Username already exists!' })
        }

        const emailExists = await User.findOne({ email })

        if (emailExists) {
            return res.status(400).json({ message: 'Email already exists!' })
        }

        //password validations
        if (password.length <= 6) {
            return res.status(400).json({ message: 'Password length should be greater than 6!' })
        }

        const hashedPassword = bcrypt.hashSync(password, 10)

        //Creation of user
        const newUser = await User.create({ name, username, email, password: hashedPassword })

        //Generate JWT
        const token = genToken(newUser._id)
        //console.log(token)
        res.cookie("token", token, cookieOptions)

        res.status(200).json(newUser)

    }

    catch {
        res.status(500).json({ message: "Internal Server Error!" })
    }
}


//Login a particular user
export const loginUser = async (req, res) => {
    //login the user

    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(422).json({ message: 'All fields are required!' })
        }

        const userExists = await User.findOne({ email })

        if (!userExists) {
            return res.status(404).json({ message: "User not Found" })
        }

        const correctPassword = bcrypt.compareSync(password, userExists.password)

        if (!correctPassword) {
            return res.status(401).json({ message: "Incorrect Password" })
        }

        const token = genToken(userExists._id)
        res.cookie("token", token, cookieOptions)

        res.status(200).json({
            message: "Login Successful",
            user: userExists
        })

    }
    catch (error) {
        res.status(500).json({ message: "Internal Server Error" }, error)
    }
}


//Getuser--> This chk user exists from the cookies and jwt so user need not login again and again when he / she opens the application
export const getUser = (req, res) => {
    //console.log(req.user) --> This gets the whole user data the previous part was for the verification
    res.status(200).json(req.user) // This will finally show the user on postman (means allow user to continue with the app after all the verifications)
}



//Logout User
export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token", cookieOptions)

        return res.status(200).json({
            message: "Logout Successful"
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error!"
        })
    }
}


//Get User Profile
export const getUserProfile = async (req, res) => {
    try {
        const { username } = req.params
        const userData = await User.findOne({ username })
                        .select("-password")
                        .populate("followers", "name username profileImage")
                        .populate("followings", "name username profileImage");

        if(!userData){
            return res.status(404).json({message : "User Not Found"})
        }

        res.status(200).json({ message: "User found", userData: userData })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error" })
    }
}

//Followers and Followings

export const followUser = async(req, res) =>{
    try {

        const currentUserId = req.user._id //This comes from the user route --> current user
        const targetUserId = req.params.id //This comes from the route call of follow and following

        //Check if the id is same as the logged in user as the user cannot follow themselves
        if(currentUserId.toString() === targetUserId.toString()){
            return res.status(409).json({message : "You cannot follow yourself"})
        }
        

        //If we are already following the user  --> Implement Unfollow --> We need to check if we are present in targetUserId's list
        const targetUser = await User.findById(targetUserId)

        if(!targetUser){
            return res.status(404).json({message : "No Target User Found"})
        }

        const alreadyFollowing = targetUser.followers.some((id)=>{
            return id.toString() === currentUserId.toString()
        })
        
        if(alreadyFollowing){
            return res.status(409).json({message : "You are already following"}) //For this we have to show an unfollow button for our client - side
        }

        //If we are not following the user --> Implement Follow
        //We can push it to the required array through push operation but we will use MongoDB opeartors for this 
        await User.findByIdAndUpdate(targetUserId, {
            $addToSet : {followers : currentUserId}
        })

        await User.findByIdAndUpdate(currentUserId, {
            $addToSet : {followings : targetUserId}
        })

        return res.status(201).json({message : "User Followed"})
        
    } 
    catch (error) {
        console.log(error)
        return res.status(500).json({message : "Internal Server Error"})
    }
}


//Unfollow

export const unfollowUser = async (req, res) => {
    try {
        const currentUserId = req.user._id;
        const targetUserId = req.params.id;

        if (currentUserId.toString() === targetUserId.toString()) {
            return res.status(409).json({ message: "You cannot unfollow yourself" });
        }

        const targetUser = await User.findById(targetUserId);

        if (!targetUser) {
            return res.status(404).json({ message: "No Target User Found" });
        }

        await User.findByIdAndUpdate(currentUserId, {
            $pull: { followings: targetUserId }
        });

        await User.findByIdAndUpdate(targetUserId, {
            $pull: { followers: currentUserId }
        });

        return res.status(200).json({ message: "User unfollowed" });
    } 
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};
