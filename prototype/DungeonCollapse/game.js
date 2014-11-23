/// <reference path="_reference.ts" />
var DungeonItem = (function () {
    function DungeonItem() {
    }
    DungeonItem.prototype.toString = function () {
        return "?";
    };
    DungeonItem.prototype.clone = function () {
        var di = new DungeonItem();
        di.name = this.name;
        di.effect = this.effect;
        return di;
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
        this.type = type;
        this.character = null;
        this.items = new Array();
    }
    DungeonTile.prototype.clone = function () {
        var cl = new DungeonTile(this.type, this.posX, this.posY);
        cl.description = this.description;
        cl.passable = this.passable;
        for (var i = 0; i < this.items.length; i++) {
            cl.addItem(this.items[i].clone());
        }
        return cl;
    };
    DungeonTile.prototype.addItem = function (item) {
        this.items.push(item);
    };
    DungeonTile.prototype.canEnter = function () {
        return this.passable && this.character == null;
    };
    DungeonTile.prototype.toString = function () {
        if (!this.passable) {
            return "X";
        }
        if (this.character != null) {
            return this.character.view;
        }
        if (this.items.length > 0) {
            return this.items[0].toString();
        }
        return ".";
    };
    DungeonTile.random = function (x, y) {
        var tile = new DungeonTile("basic", x, y);
        tile.passable = Math.random() > 0.1;
        if (Math.random() < 0.3) {
            tile.addItem(new DungeonItem());
        }
        return tile;
    };
    return DungeonTile;
})();
/// <reference path="_reference.ts" />
var Player = (function () {
    function Player(charViews) {
        this.name = charViews;
        this.mappedTiles = new Array();
        this.characters = new Array();
        this.characters.push(new Character(charViews.charAt(0)));
        this.characters.push(new Character(charViews.charAt(1)));
        this.currentCharacter = this.characters[0];
    }
    Player.prototype.nextTurn = function () {
        var i = this.characters.indexOf(this.currentCharacter);
        this.currentCharacter = this.characters[(i + 1) % this.characters.length];
    };
    Player.prototype.setupCharacters = function (side, map) {
        for (var i = 0; i < this.characters.length; i++) {
            this.characters[i].posY = i;
            if (side == "left") {
                this.characters[i].posX = 0;
            } else {
                this.characters[i].posX = map.Width - 1;
            }
            map.Get(this.characters[i].posX, this.characters[i].posY).character = this.characters[i];
        }
    };
    Player.prototype.mapTile = function (tile) {
        if (this.mappedTiles.indexOf(tile) == -1) {
            this.mappedTiles.push(tile);
        }
    };
    return Player;
})();
/// <reference path="_reference.ts" />
var Dungeon = (function () {
    function Dungeon(p1, p2, map) {
        this.p1 = p1;
        this.p2 = p2;
        this.cp = p1;
        this.map = map;
        this.p1.setupCharacters("left", this.map);
        this.p2.setupCharacters("right", this.map);
        for (var i = 0; i < this.p1.characters.length; i++) {
            var pc1 = this.p1.characters[i];
            var pc2 = this.p2.characters[i];
            this.p1.mapTile(this.map.Get(pc1.posX, pc1.posY));
            this.p2.mapTile(this.map.Get(pc2.posX, pc2.posY));
        }
    }
    Dungeon.prototype.nextTurn = function () {
        this.cp = this.cp === this.p1 ? this.p2 : this.p1;
        this.cp.nextTurn();
    };
    Dungeon.prototype.handleInput = function (input) {
        if (!isNaN(parseFloat(input)) && isFinite(input)) {
            //its a direction
            this.moveCharacter(this.cp.currentCharacter, input);
        } else {
            //its something else
        }
    };

    Dungeon.prototype.moveCharacter = function (character, direction) {
        var targetX = character.posX + directions[direction].x;
        var targetY = character.posY + directions[direction].y;

        if (this.map.Inside(targetX, targetY)) {
            console.log(character.view, character.posX, character.posY, targetX, targetY, this.map.Get(targetX, targetY).posX, this.map.Get(targetX, targetY).posY);
            var tile = this.map.Get(targetX, targetY);
            if (tile.canEnter()) {
                this.moveCharacterToTile(character, tile);
            } else {
                this.cp.mapTile(tile);
            }
        }
    };
    Dungeon.prototype.moveCharacterToTile = function (ch, tile) {
        this.map.Get(ch.posX, ch.posY).character = null;
        ch.moveToTile(tile);
        tile.character = ch;
        this.cp.mapTile(tile);
    };

    Dungeon.prototype.handlePlayerAction = function (player, action, targetX, targetY) {
    };

    Dungeon.prototype.toString = function (mappedTiles) {
        var str = this.cp.name + " - " + this.cp.currentCharacter.view + "</br>";
        for (var i = 0; i < this.map.Height; i++) {
            for (var j = 0; j < this.map.Width; j++) {
                var chr = "#";
                if (mappedTiles.indexOf(this.map.Get(j, i)) != -1) {
                    chr = this.map.Get(j, i).toString();
                }
                str += chr;
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
        this.player1 = new Player("ab"); //0,0,"1");
        this.player2 = new Player("12"); //0, 12, "2");
        var map = new DungeonBuilder(18, 7, this.player1, this.player2).build();
        this.currentDungeon = new Dungeon(this.player1, this.player2, map);
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
                direction = 0;
                break;
            case 38:
                direction = 1;
                break;
            case 39:
                direction = 2;
                break;
            case 40:
                direction = 3;
                break;
        }
        if (direction >= 0) {
            this.currentDungeon.handleInput(direction);
            this.nextTurn();
        } else {
            this.nextTurn();
        }
    };
    Game.prototype.draw = function () {
        this.element.innerHTML = this.currentDungeon.toString(this.currentDungeon.cp.mappedTiles);
    };

    Game.prototype.nextTurn = function () {
        this.currentDungeon.nextTurn();
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
/// <reference path="_reference.ts" />
var Character = (function () {
    function Character(view) {
        this.health = 100;
        this.view = view;
    }
    Character.prototype.setPos = function (x, y) {
        this.posX = x;
        this.posY = y;
    };
    Character.prototype.moveToTile = function (tile) {
        this.setPos(tile.posX, tile.posY);
    };
    return Character;
})();
var DungeonBuilder = (function () {
    function DungeonBuilder(w, h, p1, p2) {
        this.width = w;
        this.height = h;
    }
    DungeonBuilder.prototype.build = function () {
        var map = new Grid(this.width, this.height);
        for (var i = 0; i < Math.floor(this.width / 2); i++) {
            map.Cells[i] = new Array();
            for (var j = 0; j < map.Height; j++) {
                var tile = DungeonTile.random(i, j);
                map.Set(i, j, tile);
                var mirror = tile.clone();
                mirror.posX = (this.width - 1) - i;
                map.Set((this.width - 1) - i, j, mirror);
            }
        }
        return map;
    };
    return DungeonBuilder;
})();
var Grid = (function () {
    function Grid(w, h) {
        this.Width = w;
        this.Height = h;
        this.Cells = new Array();
        for (var i = 0; i < this.Width; i++) {
            var row = new Array();
            for (var j = 0; j < this.Height; j++) {
                row.push(null);
            }
            this.Cells.push(row);
        }
    }
    Grid.prototype.Set = function (x, y, content) {
        this.Cells[x][y] = content;
    };
    Grid.prototype.Get = function (x, y) {
        return this.Cells[x][y];
    };
    Grid.prototype.Inside = function (x, y) {
        return x >= 0 && x < this.Width && y >= 0 && y < this.Height;
    };
    Grid.prototype.AsString = function () {
        var str = "";
        for (var i = 0; i < this.Width; i++) {
            for (var j = 0; j < this.Height; j++) {
                str += this.Cells[i][j].toString();
            }
            str += "\n";
        }
        return str;
    };
    Grid.prototype.Dump = function () {
        console.log(this.AsString());
    };
    Grid.prototype.GetNeighbour = function (dir, x, y) {
        var nx = x, ny = y;
        switch (dir) {
            case "up":
                ny--;
                break;
            case "down":
                ny++;
                break;
            case "left":
                nx--;
                break;
            case "right":
                nx++;
                break;
        }
        if (this.Inside(nx, ny))
            return this.Cells[nx][ny];
        else
            return null;
    };

    Grid.prototype.Middle = function () {
        return this.Cells[Math.floor((this.Width - 1) / 2)][Math.floor((this.Height - 1) / 2)];
    };
    Grid.prototype.Flip = function (horizontal) {
        if (horizontal) {
            for (var i = 0; i < this.Width / 2; i++) {
                for (var j = 0; j < this.Height; j++) {
                    var target = i + ((this.Width - 1) - (i * 2));
                    var temp = this.Cells[i][j];
                    this.Cells[i][j] = this.Cells[target][j];
                    this.Cells[target][j] = temp;
                }
            }
        } else {
            for (var i = 0; i < this.Width; i++) {
                for (var j = 0; j < this.Height / 2; j++) {
                    var target = j + ((this.Height - 1) - (j * 2));
                    var temp = this.Cells[i][j];
                    this.Cells[i][j] = this.Cells[i][target];
                    this.Cells[i][target] = temp;
                }
            }
        }
    };
    return Grid;
})();
//# sourceMappingURL=game.js.map
