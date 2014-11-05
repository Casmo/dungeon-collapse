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
    function DungeonTile(type) {
        this.invisible = false;
        this.type = type;
        this.items = new Array();
    }
    DungeonTile.prototype.addItem = function (item) {
        this.items.push(item);
    };

    DungeonTile.prototype.toString = function () {
        if (this.invisible) {
            return " ";
        }
        if (!this.passable) {
            return "#";
        }
        if (this.items.length > 0) {
            return this.items[0].toString();
        }
        return ".";
    };
    DungeonTile.random = function () {
        var tile = new DungeonTile("basic");
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
    }
    return Player;
})();
/// <reference path="_reference.ts" />
var Dungeon = (function () {
    function Dungeon(w, h) {
        this.width = w;
        this.height = h;
        this.grid = new Array();
        for (var i = 0; i < this.width; i++) {
            this.grid[i] = new Array();
            for (var j = 0; j < this.height; j++) {
                this.grid[i][j] = DungeonTile.random();
            }
        }
    }
    Dungeon.prototype.movePlayer = function (player, direction) {
        var targetX = player.posX + directions[direction].x;
        var targetY = player.posY + directions[direction].y;
        if (this.validPosition(targetX, targetY)) {
            player.posX = targetX;
            player.posY = targetY;
        }
    };
    Dungeon.prototype.validPosition = function (x, y, mustBePassable) {
        if (typeof mustBePassable === "undefined") { mustBePassable = true; }
        var safe = (x >= 0 && x < this.width && y >= 0 && y < this.height);
        if (mustBePassable) {
            return safe && this.grid[x][y].passable;
        }
        return safe;
    };
    Dungeon.prototype.handlePlayerAction = function (player, action, targetX, targetY) {
    };
    Dungeon.prototype.toString = function (p1, p2) {
        var str = "";
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                if (i == p1.posX && j == p1.posY) {
                    str += p1.view;
                } else if (i == p2.posX && j == p2.posY) {
                    str += p2.view;
                } else {
                    str += this.grid[i][j].toString();
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
        this.currentDungeon = new Dungeon(7, 13);
        this.player1 = new Player(0, 0, "1");
        this.player2 = new Player(0, 12, "2");
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
        this.element.innerHTML = this.currentDungeon.toString(this.player1, this.player2);
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
