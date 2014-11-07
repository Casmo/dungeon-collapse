/// <reference path="_reference.ts" />
var DungeonItem = (function () {
    function DungeonItem() {
    }
    DungeonItem.prototype.toString = function () {
        return "?";
    };
    return DungeonItem;
})();
/// <reference path="_reference.ts" />
var DungeonTile = (function () {
    function DungeonTile(type, x, y) {
        if (typeof x === "undefined") { x = -1; }
        if (typeof y === "undefined") { y = -1; }
        this.posX = x;
        this.posY = y;
        this.invisible = false;
        this.type = type;
        this.items = new Array();
    }
    DungeonTile.prototype.addItem = function (item) {
        this.items.push(item);
    };

    DungeonTile.prototype.toString = function () {
        if (!this.passable) {
            return "0";
        }
        if (this.items.length > 0) {
            return this.items[0].toString();
        }
        return ".";
    };
    DungeonTile.random = function (x, y) {
        var tile = new DungeonTile("basic", x, y);
        tile.passable = Math.random() > 0.2;
        if (Math.random() < 0.3) {
            tile.addItem(new DungeonItem());
        }
        return tile;
    };
    return DungeonTile;
})();
/// <reference path="_reference.ts" />
var Player = (function () {
    function Player(startX, startY, view) {
        this.posX = startX;
        this.posY = startY;
        this.health = 100;
        this.view = view;
        this.mappedTiles = new Array();
    }
    Player.prototype.moveToTile = function (tile) {
        this.posX = tile.posX;
        this.posY = tile.posY;
        this.mapTile(tile);
    };
    Player.prototype.mapTile = function (tile) {
        if (this.mappedTiles.indexOf(tile) == -1) {
            this.mappedTiles.push(tile);
        }
    };
    Player.prototype.clearTile = function (tile) {
        this.mapTile(tile);
    };
    return Player;
})();
/// <reference path="_reference.ts" />
var Dungeon = (function () {
    function Dungeon(w, h, p1, p2) {
        this.width = w;
        this.height = h;
        this.player1 = p1;
        this.player2 = p2;

        this.grid = new Array();
        for (var i = 0; i < this.width; i++) {
            this.grid[i] = new Array();
            for (var j = 0; j < this.height; j++) {
                this.grid[i][j] = DungeonTile.random(i, j);
            }
        }
        this.player1.clearTile(this.grid[this.player1.posX][this.player1.posY]);
        this.player2.clearTile(this.grid[this.player2.posX][this.player2.posY]);
    }
    Dungeon.prototype.movePlayer = function (player, direction) {
        var targetX = player.posX + directions[direction].x;
        var targetY = player.posY + directions[direction].y;
        if (this.validPosition(targetX, targetY)) {
            var tile = this.grid[targetX][targetY];
            var otherPlayer = this.getOtherPlayer(player);
            if (!tile.passable || (otherPlayer.posX == tile.posX && otherPlayer.posY == tile.posY)) {
                player.clearTile(tile);
            } else
                player.moveToTile(tile);
        }
    };
    Dungeon.prototype.validPosition = function (x, y) {
        return (x >= 0 && x < this.width && y >= 0 && y < this.height);
    };
    Dungeon.prototype.handlePlayerAction = function (player, action, targetX, targetY) {
    };
    Dungeon.prototype.getOtherPlayer = function (player) {
        return (player == this.player1) ? this.player1 : this.player2;
    };
    Dungeon.prototype.toString = function (player) {
        var str = "";
        var otherPlayer = this.getOtherPlayer(player);
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                if (player.posX == i && player.posY == j) {
                    str += player.view;
                } else if (player.mappedTiles.indexOf(this.grid[i][j]) != -1) {
                    if (otherPlayer.posX == i && otherPlayer.posY == j) {
                        str += otherPlayer.view;
                    } else
                        str += this.grid[i][j].toString();
                } else {
                    str += "#";
                }
            }
            str += "</br>";
        }
        return str;
    };
    return Dungeon;
})();
/// <reference path="_reference.ts" />
var Game = (function () {
    function Game(element) {
        this.element = element;
    }
    Game.prototype.setup = function () {
        this.player1 = new Player(0, 0, "1");
        this.player2 = new Player(0, 12, "2");
        this.currentDungeon = new Dungeon(7, 13, this.player1, this.player2);
        this.currentPlayer = this.player1;
        var self = this;
        document.addEventListener('keydown', function (event) {
            self.handleKey(event.keyCode);
        });
    };
    Game.prototype.handleKey = function (keyCode) {
        var direction = -1;
        switch (keyCode) {
            case 37:
                direction = 1;
                break;
            case 38:
                direction = 0;
                break;
            case 39:
                direction = 3;
                break;
            case 40:
                direction = 2;
                break;
        }
        if (direction >= 0) {
            this.currentDungeon.movePlayer(this.currentPlayer, direction);
            this.nextTurn();
        }
    };
    Game.prototype.draw = function () {
        this.element.innerHTML = this.currentDungeon.toString(this.currentPlayer);
    };
    Game.prototype.nextTurn = function () {
        this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
        this.draw();
    };
    Game.prototype.start = function () {
        this.setup();
        this.draw();
    };

    Game.prototype.stop = function () {
    };
    return Game;
})();

var game;
var Direction;
(function (Direction) {
    Direction[Direction["LEFT"] = 0] = "LEFT";
    Direction[Direction["UP"] = 1] = "UP";
    Direction[Direction["RIGHT"] = 2] = "RIGHT";
    Direction[Direction["DOWN"] = 3] = "DOWN";
})(Direction || (Direction = {}));
;
var directions = [{ x: -1, y: 0 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }];

window.onload = function () {
    var el = document.getElementById('content');
    game = new Game(el);
    game.start();
};
/// <reference path="dungeonitem.ts" />
/// <reference path="dungeontile.ts" />
/// <reference path="player.ts" />
/// <reference path="dungeon.ts" />
/// <reference path="game.ts" />
//# sourceMappingURL=game.js.map
