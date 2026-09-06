import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv'
import userRoutes from "./routes/user.routes.js";
import cookieParser from "cookie-parser";

dotenv.config()
const app = express()

const port = 8082

mongoose.connect(process.env.dbUrl).then(()=>{
    console.log('DB Connected')
}).catch((err)=>{
    console.log(err)
})

app.use(express.json())
app.use(cookieParser())

app.use('/users', userRoutes)


app.listen(port, ()=>{
    console.log(`Server started at ${port}`)
})