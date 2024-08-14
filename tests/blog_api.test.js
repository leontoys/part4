const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')


const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
  }  
]

beforeEach(async () => {  
    //delet all 
    await Blog.deleteMany({})  
    //create new
    let blogObject = new Blog(initialBlogs[0])  
    //save
    await blogObject.save()  
    //create new
    blogObject = new Blog(initialBlogs[1])  
    //save
    await blogObject.save()  
    //create new
    blogObject = new Blog(initialBlogs[2])  
    //save
    await blogObject.save()  
    //create new
    blogObject = new Blog(initialBlogs[3])  
    //save
    await blogObject.save()  
    //create new
    blogObject = new Blog(initialBlogs[4])  
    //save
    await blogObject.save()    
    //create new
    blogObject = new Blog(initialBlogs[5])  
    //save
    await blogObject.save()            
    
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('there are five blogs', async () => {
    const response = await api.get('/api/blogs')
  
    assert.strictEqual(response.body.length, initialBlogs.length)
  })
  
test('the first of the blogs is React patterns', async () => {
    const response = await api.get('/api/blogs')
  
    const titles = response.body.map(e => e.title)
    assert(titles.includes('React patterns'))
})

test('the unique identifier is id and not _id', async () => {
    const response = await api.get('/api/blogs')
    const ids = response.body.map(e => e.id)
    assert(ids)
  })

  test('a valid blog can be added ', async () => {
    const newBlog = {
            title: "Free Code Camp",
            author: "Quincy Larson",
            url: "https://www.freecodecamp.org/news/",
            likes: 100,
          }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  
    const response = await api.get('/api/blogs')
  
    const titles = response.body.map(r => r.title)
  
    assert.strictEqual(response.body.length, initialBlogs.length + 1)
  
    assert(titles.includes('Free Code Camp'))
  })  

after(async () => {
  await mongoose.connection.close()
})