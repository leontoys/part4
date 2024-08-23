const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

//helper method
const getTokenFrom = request => {
  //from the request get authorization part
  const authorization = request.get('authorization')
  //check if it starts with bearer - we are using bearer scheme
  if (authorization && authorization.startsWith('Bearer ')) {
    //if yes, clean up by removing the bearer
    return authorization.replace('Bearer ', '')
  }
  return null
}

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })    
    response.json(blogs)
  })

blogsRouter.get('/:id', (request, response, next) => {
  Blog.findById(request.params.id)
    .then(blog => {
      if (blog) {
        response.json(blog)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  //const decodedToken = jwt.verify(request.token,process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  console.log("token decoded with middleware")
  const user = await User.findById(decodedToken.id)  

  if (!body.title || !body.url) {
    return response.sendStatus(400)
  }

  //find any user
  //const user = await User.findOne()
  
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user : user.id 
  })

 
  try{
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)  
    await user.save()     
    response.status(201).json(savedBlog)
  }
  catch(exception){
    next(exception)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  console.log("reached here")
  console.log("parameter",request.params.id)
  try{
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } 
  catch(exception){
    next(exception)
  } 
})

blogsRouter.put('/:id', (request, response, next) => {
  logger.info("put",request.body)
  const body = request.body

  const note = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  }

  Blog.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedBlog => {
      response.json(updatedBlog)
    })
    .catch(error => next(error))
})

module.exports = blogsRouter