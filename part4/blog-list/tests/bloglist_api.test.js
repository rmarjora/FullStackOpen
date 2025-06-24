const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const helper = require('./helper')

const api = supertest(app)

beforeEach(async () => {
    await helper.initializeDB()
})

test('All notes are returned in JSON format', async () => {
    const blogsAtStart = await helper.getAllBlogs()
    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.length, blogsAtStart.length)
})

test('identifier property is named \'id\'', async () => {
    const blog = await Blog.findOne({})
    assert.notStrictEqual(blog.id, undefined)
})

test('A blog can be created via HTTP POST request', async () => {
    const blogsAtStart = await helper.getAllBlogs()
    const testBlog = {
        title: "Test",
        author: "Test Author",
        url: "test.test",
        likes: 42
    }
    await api.post('/api/blogs').send(testBlog).expect(201).expect('Content-Type', /application\/json/)

    const allBlogs = await Blog.find({})
    assert.strictEqual(allBlogs.length, blogsAtStart.length + 1)
})

test('Blog with missing likes defaults to 0 likes', async () => {
    const testBlog = {
        title: "No Likes",
        author: "Test Author",
        url: "test.test"
    }
    
    await Blog.create(testBlog)

    const noLikesBlog = await Blog.findOne(testBlog)
    assert.strictEqual(noLikesBlog.likes, 0)
})

test('Respond with 400 Bad Request when Blog is missing title or url', async () => {
    const testBlogs = [
        {
            author: "No Title Author",
            url: "test.test",
            likes: 0
        },
        {
            title: "No url",
            author: "No URL Author",
            likes: 0
        }
    ]
    
    for (const testBlog of testBlogs) {
        await api
            .post('/api/blogs')
            .send(testBlog)
            .expect(400)
    }
})

test('A blog can be deleted', async () => {
    const blogsAtStart = await helper.getAllBlogs()
    const blog = await Blog.findOne({})
    const idToDelete = blog.id
    await api.delete(`/api/blogs/${idToDelete}`).expect(204)

    const blogsAtEnd = await Blog.find({})
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)
})

test('The likes of a blog can be updated', async () => {
    
})

describe('User tests', () => {
  test('Creating non-unique username fails', async () => {
    const usersAtStart = await helper.getAllUsers()
    const newUser = {
      username: 'testuser',
      name: 'Test User',
        password: 'testpassword'
    }
    const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    assert(result.body.error.includes('expected `username` to be unique'))
    const usersAtEnd = await helper.getAllUsers()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
    
  test('User creation fails when password is too short', async () => {
    const usersAtStart = await helper.getAllUsers()
    const newUser = {
      username: 'us',
      name: 'Test User',
      password: 'pw'
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)
    assert(result.body.error.includes('Password length must be at least 3 characters'))
    const usersAtEnd = await helper.getAllUsers()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
 })
})

after(async () => {
    await mongoose.connection.close()
})