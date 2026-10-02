import uploadReelToCloudinary from "../utils/uploadReelToCloudinary.js";
import Reel from "../models/reel.model.js";
import User from "../models/user.model.js";

// create reel
export const createReel = async (req, res) => {
    try {
        const { caption } = req.body

        if (caption.length > 500) {
            res.status(401).json({ message: 'Caption Cannot be more than 500 characters ' })
        }


        let video;

        if (req.file) {
            const uploadedVideo = await uploadReelToCloudinary(req.file.buffer)
            video = uploadedVideo.secure_url
        }


        //reel used in as object to extract id and othe things done below
        const reel = await Reel.create({
            author: req.user._id,
            caption: caption,
            video
        })

        // save the post id for the user

        await User.findByIdAndUpdate(req.user._id,{
            $push : {reels : reel._id}
        })

        //extract username, name, profileImage from author
        const populatedReel = await Reel.findById(reel._id).populate('author', 'name username profileImage')

        res.status(201).json({message : "Reel Created" , reel : populatedReel})



    } 
    catch (error) {
        return res.status(500).json({message : "Internal Server Error"})
    }
}

// get reel
