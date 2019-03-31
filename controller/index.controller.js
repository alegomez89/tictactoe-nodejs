const arrayUtils = require('../utils/arrayUtils');

exports.newGame = async (req, res, redisDb) => {
    try {
        const newRoom = {
            player: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
            cpu: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
        };

        await redisDb.set('room', JSON.stringify(newRoom), function (err, reply) {
            console.log(reply);
        });

        redisDb.get('room', function (err, reply) {
            res.json(JSON.parse(reply));
        });
    } catch (e) {
        res.status(500).json(e);
    }

};

exports.userMove = async (req, res, redisDb) => {
    try {
        const gameUpdate = req.body.game;
        const userWin = checkWins(gameUpdate.player);
        const noMoreMovements = (gameUpdate.numberMovement === 9? true : false);
        await redisDb.set('room', JSON.stringify(gameUpdate), function (err, reply) {
            console.log(reply);
        });
        redisDb.get('room', function (err, reply) {
            res.json({
                status: 'OK',
                message: userWin ? 'You won the match!' : 'Human movement registered',
                game: JSON.parse(reply),
                finished: userWin || noMoreMovements,
                userWin: userWin,
                cpuWin: false,
            });
        });
    } catch (e) {
        res.status(500).json(e);
    }

};


exports.cpuMove = async (req, res, redisDb) => {
    const gameUpdate = req.body.game;
    const cpuWin = checkWins(gameUpdate.cpu);
    const noMoreMovements = (gameUpdate.numberMovement === 9);
    await redisDb.set('room', JSON.stringify(gameUpdate), function (err, reply) {
        console.log(reply);
    });
    redisDb.get('room', function (err, reply) {
        res.json({
            status: 'OK',
            message: cpuWin ? 'CPU won de match!' : 'CPU movement registered',
            game: JSON.parse(reply),
            finished: cpuWin || noMoreMovements,
            userWin: false,
            cpuWin: cpuWin,
        });
    });
};

function checkWins(gamePlayer) {
    try {
        const horizontalWinScores = [[1, 2, 4], [8, 16, 32], [64, 128, 256]];
        const verticalWinScores = [[1, 8, 64], [2, 16, 128], [4, 32, 256]];
        const diagonalWinScores = [[1, 16, 256], [64, 16, 4]];

        // chequear si hay victoria de manera horizontal
        for (let i = 0; i < horizontalWinScores.length; i++) {
            if (gamePlayer.contains(horizontalWinScores[i])) {
                return true;
                break;
            }
        }

        // chequear si hay victoria de manera vertical
        const gamePlayerTranspose = arrayUtils.transpose(gamePlayer);
        for (let i = 0; i < verticalWinScores.length; i++) {
            if (gamePlayerTranspose.contains(verticalWinScores[i])) {
                return true;
                break;
            }
        }

        // chequear si hay victoria de manera diagonal
        const gamePlayerDiagonal = [
            [gamePlayer[0][0], gamePlayer[1][1], gamePlayer[2][2]],
            [gamePlayer[2][0], gamePlayer[1][1], gamePlayer[0][2]],
        ];
        for (let i = 0; i < diagonalWinScores.length; i++) {
            if (gamePlayerDiagonal.contains(diagonalWinScores[i])) {
                return true;
                break;
            }
        }
        return false;
    } catch (e) {
        console.log(e);
    }
};

