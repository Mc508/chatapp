require("dotenv").config();
import express from "express"
import cors from "cors"
import CookieParser from "cookieparser";
import { connect } from "./db/db";
import path from "path"

const app = express()
const port = process.env.PORT
connect()
app.use(express.json())
app.use(CookieParser())

const allowedorigins = [
    "http://localhost:5173",
    "http://localhost:4000",
]

const corsOptions = {
    origin:(origin,callback)=>{
        if(allowedorigins.includes(origin)||origin){
            callback(null,true)
        }else{
            callback(new Error("Not allowed origin by cors "))
        }
    },
    methods:"GET,HEAD,PUT,PATCH,POST,DELETE",
    optionSuccessStatus:204,
    credentials:true
}

app.use(cors(corsOptions))

const server = app.listen(port,()=>{
    console.log("Server connected successfully");
})