const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const redisDB = require("./db/redis").connectDB();
const app = express();
const cors = require('cors');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({origin: 'http://localhost:4200'}));



const socketio = require('socket.io');
const socketEvents = require('./sockets/socketEvent');
this.socket = socketio(this.http);
new socketEvents(this.socket, redisDB).socketConfig();
new indexRouter(app,redisDB).routesConfig();


module.exports = app;
