import mongoose from "mongoose";    

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },

    username : {
        type : String,
        required : true,
        unique : true
    },

    email : {
        type : String,
        required : true,
        unique : true
    },

    password : {
        type : String,
        required : true
    },

    phone : {
        type : Number
    },

    bio : {
        type : String
    },

    followers : [
        //ids to be stored
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    ],

    followings : [
        //ids to be stored
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "User"
        }
    ],

    posts : [
        //ids to be stored
    ],

    stories : [
        //ids to be stored
    ],

    reels : [
        //ids to be stored
    ],

    profileImage : {
        //stores urls
        type : String
    }
}, { timestamps: true })



const User = mongoose.model('User', userSchema)

export default User