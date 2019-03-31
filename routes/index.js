const express = require('express');
const router = express.Router();
const indexController = require('../controller/index.controller');

class Routes {

    constructor(app,redisDB){
        this.redisDB = redisDB;
        this.app = app;
    }

    appRoutes() {
        const redisDB = this.redisDB;
        this.app.get('/newGame', function (req, res, next) {
            indexController.newGame(req, res, redisDB);
        });

        this.app.post('/userMove', function (req, res, next) {
            indexController.userMove(req, res, redisDB);
        });

        this.app.post('/cpuMove', function (req, res, next) {
            indexController.cpuMove(req, res, redisDB);
        });
    }

    routesConfig(){
        this.appRoutes();
    }
}

module.exports = Routes;
