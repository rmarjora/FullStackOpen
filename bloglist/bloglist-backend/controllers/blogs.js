require('express-async-errors')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.status(200).json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const payload = jwt.verify(request.token, process.env.SECRET)

  if (!payload.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(payload.id)

  console.log(`Found user: ${user}`)

  if (!user) {
    return response.status(401).json({ error: 'user not found' })
  }

  const blog = new Blog({
    ...request.body,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const payload = jwt.verify(request.token, process.env.SECRET)

  if (!payload.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = await User.findById(payload.id)

  console.log(`Found user: ${user}`)

  if (!user) {
    return response.status(401).json({ error: 'user not found' })
  }

  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() !== user._id.toString()) {
    return response.status(403).json({ error: 'you do not have permission to delete this blog' })
  }

  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, request.body)
    response.status(200).json(updatedBlog)
})

module.exports = blogsRouter