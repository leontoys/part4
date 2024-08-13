const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
//require('dotenv').config()
const config = require('./utils/config')

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const mongoUrl = config.MONGODB_URI
console.log('connecting to', mongoUrl)
mongoose.connect(mongoUrl)

app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
  console.log('hello')
  res.send('hello')
})

app.get('/api/blogs', (request, response) => {
  console.log('get all blogs')
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  console.log("create new blog")
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

const PORT = config.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})