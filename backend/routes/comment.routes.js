import express from "express";
import isAuthenticated from "../middlewares/authMiddleware.js";
import {
    createComment,
    deleteComment,
    getComments
} from "../controllers/comment.controller.js";

const commentRoutes = express.Router();

//type can be either "post" or "reel".
commentRoutes.get("/:type/:id", isAuthenticated, getComments);
commentRoutes.post("/:type/:id", isAuthenticated, createComment);
commentRoutes.delete("/:commentId", isAuthenticated, deleteComment);

export default commentRoutes;
