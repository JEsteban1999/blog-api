const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Post = require('./models/Post');
require('dotenv').config({path: 'variables.env'});

const app = express();
const PORT = process.env.PORT || 3000;

// Conexion a la base de datos
mongoose.connect(process.env.DB_MONGO);

app.use(bodyParser.json());

app.use(cors());

// Operaciones CRUD

// Post
app.post('/posts', async (req, res) => {
    try {
        const { title, content, category, tags } = req.body;
        const newPost = new Post({ title, content, category, tags });
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

// Put
app.put('/posts/:id', async (req, res) => {
    try {
        const {title, content, category, tags} = req.body;
        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            {title, content, category, tags},
            {new: true, runValidators: true}
        );
        if (!updatedPost) return res.status(404).json({message: 'Post no encontrado'});
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

// Delete
app.delete('/posts/:id', async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        if (!deletedPost) return res.status(404).json({messsage: 'Post no encontrado'});
        res.status(200).send();
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

// Get one post
app.get('/posts/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({message: 'Post no encontrado'});
        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

// Get all posts
app.get('/posts', async (req, res) => {
    try {
        const {term} = req.query;
        const query = term
            ? {
                $or: [
                    {title: new RegExp(term, 'i')},
                    {content: new RegExp(term, 'i')},
                    {category: new RegExp(term, 'i')},
                ]
            }
            : {};
        const posts = await Post.find(query);
        res.status(200).json(posts);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})