import uploadCloudinary from "../utils/uploadCloudinary.js";
import Post from "../models/post.model.js";

// create post
export const createPost = async (req, res) => {
    try {
        const { caption } = req.body

        if (caption.length > 500) {
            res.status(401).json({ message: 'Caption Cannot be more than 500 characters ' })
        }


        let image;

        if (req.file) {
            const uploadedImage = await uploadCloudinary(req.file.buffer)
            image = uploadedImage.secure_url
        }


        const post = await Post.create({
            author: req.user._id,
            caption: caption,
            image
        })

        //extract username, name, profileImage from author
        // save post id for the user


        res.status(201).json({message : "Post Created" , post : post})






    } catch (error) {

    }
}

// get post
