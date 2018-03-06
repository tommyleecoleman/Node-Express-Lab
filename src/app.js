const bodyParser = require('body-parser');
const express = require('express');

const { server } = require('./server.js');
const posts = [
    {
        title: "test post",
        contents: "test test test test",
        id: 0
    },
];
let id = 1;
const STATUS_USER_ERROR = 422;

server.use(bodyParser.json());

server.get('/posts', (req, res) => {
    const term = req.query.term;
    const postFilter = posts.filter(post => {
      return post.title.includes(term) || post.contents.includes(term);
    });
    if (term) {
      res.send(postFilter);
    } else {
      res.send(posts);
    }
});

server.post('/posts', (req, res) => {
    let title = req.body.title;
    let contents = req.body.contents;
    if (title === undefined || contents === undefined) {
        res
        .status(STATUS_USER_ERROR)
        .send({ error: 'Please enter both title and contents.' });
    }
    else {
        let newPost = { title, contents , id };
        posts.push(newPost);
        id++;
        res.send(newPost);
    }
});

server.put('/posts', (req, res) => {
    let title = req.body.title;
    let contents = req.body.contents;
    let postid = req.body.id;
    let idArr = posts.map(post => { return post.id });

    if (title === undefined || contents === undefined || id === undefined) {
        res
        .status(STATUS_USER_ERROR)
        .send({ error: 'Please enter title, contents, and id.' });
    }
    if (idArr.includes(postid)) {
        let index = idArr.indexOf(postid);
        let updatedPost = { id: postid, title, contents }; 
        posts.splice(index, 1, updatedPost);
        res.send(updatedPost);
    } else {
        res
        .status(STATUS_USER_ERROR)
        .send({ error: "ID does not exist!"});
    }
});

server.delete('/posts', (req, res) => {
    let postid = req.body.id;
    let idArr = posts.map(post => { return post.id });

    if (id === undefined) {
        res
        .status(STATUS_USER_ERROR)
        .send({ error: 'Please enter an ID.' });
    }
    if (idArr.includes(postid)) {
        let index = idArr.indexOf(postid);
        posts.splice(index, 1);
        res.send({ success: true });
    } else {
        res
        .status(STATUS_USER_ERROR)
        .send({ error: "ID does not exist!"});
    }
});

server.listen(3000);