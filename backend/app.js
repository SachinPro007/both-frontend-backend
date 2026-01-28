// Core modules
const path = require('path')

// External modules
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

// local module
const rootDir = require('./utils/pathUtil')
// const pageNotFound = require('./controllers/errors')
const todoItemsRouter = require('./routes/todosItemRoute')

const app = express()

// middlewares
app.use(express.urlencoded())
app.use(express.static(path.join(rootDir, "public")))
app.use(express.static(path.join(rootDir, "../frontend/dist")))
app.use(express.json())
app.use(cors())



app.use("/api/todos", todoItemsRouter)
// app.use(pageNotFound)
app.use((_, res) => {
  res.sendFile(path.join(rootDir, "../frontend/dist", "index.html"))  
})



const PORT = 3000;
mongoose.connect(process.env.DB_URL).then(res => {
  console.log("MongoDB connected");
  
  app.listen(PORT, () => {
    console.log("server run on port: ", PORT);    
  })
}).catch(err => {
  console.log("Something went wrong on connect with DB", err);
  
})