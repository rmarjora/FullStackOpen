const assert = require('node:assert')
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const api = supertest(app)

const initialBlogs = [
    {
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7
    },
    {
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5
    },
    {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12
    },
    {
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10
    },
    {
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0
    },
    {
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(initialBlogs)
})

test('All notes are returned in JSON format', async () => {
    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    assert.strictEqual(response.body.length, initialBlogs.length)
})

test('identifier property is named \'id\'', async () => {
    const blog = await Blog.findOne({})
    assert.notStrictEqual(blog.id, undefined)
})

test('A blog can be created via HTTP POST request', async () => {
    const testBlog = {
        title: "Test",
        author: "Test Author",
        url: "test.test",
        likes: 42
    }
    await api.post('/api/blogs').send(testBlog).expect(201).expect('Content-Type', /application\/json/)

    const allBlogs = await Blog.find({})
    assert.strictEqual(allBlogs.length, initialBlogs.length + 1)
})

test('Blog with missing likes defaults to 0 likes', async () => {
    const testBlog = {
        title: "No Likes",
        author: "Test Author",
        url: "test.test"
    }
    
    await Blog.insertOne(testBlog)

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
            autor: "No URL Author",
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
    const blog = await Blog.findOne({})
    const idToDelete = blog.id
    await api.delete(`/api/blogs/${idToDelete}`).expect(204)

    const allBlogs = await Blog.find({})
    assert.strictEqual(allBlogs.length, initialBlogs.length - 1)
})

test('The likes of a blog can be updated', async () => {
    
})

after(async () => {
    await mongoose.connection.close()
})