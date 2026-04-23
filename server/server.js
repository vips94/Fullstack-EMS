import express from 'express';
import cors from 'cors';
import "dotenv/config";
import multer from 'multer';
import connectDB from './config/db.js';

const app = express();  //create instance of express
const PORT = process.env.PORT || 4000;

//Middleware
app.use(cors());  //all the request will be parsed using this
app.use(express.json());  //all request will be parsed using json format
app.use(multer().none());  //multer is use for parsing form data


//Routes
app.get("/", (req,res)=> res.send("Server is running"))



await connectDB();
// start the server
app.listen(PORT,()=> console.log(`server is listening to port ${PORT}`))



