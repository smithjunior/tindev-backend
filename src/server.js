const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://omnistack8_tindev:omnistack8_tindev@cluster0-45kku.mongodb.net/omnistack8_tindev?retryWrites=true&w=majority',{
    useNewUrlParser: true
});

const cors =  require('cors');

const express = require('express');
const routes = require('./routes');
const server = express();

server.use(cors());
server.use(express.json());
server.use(routes);

server.listen(3333);