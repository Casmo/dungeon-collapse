/// <reference path="_reference.ts" />
var DungeonItem = (function () {
    function DungeonItem() {
    }
    DungeonItem.prototype.toString = function () {
        return "@";
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
        tile.passable = Math.random() > 0.3;
        if (Math.random() < 0.2) {
            tile.addItem(new DungeonItem());
        }
        return tile;
    };
    return DungeonTile;
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
    Dungeon.prototype.toString = function () {
        var str = "";
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                str += this.grid[i][j].toString();
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
        this.setup();
    }
    Game.prototype.setup = function () {
        this.currentDungeon = new Dungeon(7, 13);
    };
    Game.prototype.start = function () {
        this.element.innerHTML = this.currentDungeon.toString();
    };

    Game.prototype.stop = function () {
    };
    return Game;
})();

var game;
window.onload = function () {
    var el = document.getElementById('content');
    game = new Game(el);
    game.start();
};
/// <reference path="dungeonitem.ts" />
/// <reference path="dungeontile.ts" />
/// <reference path="dungeon.ts" />
/// <reference path="game.ts" />
//# sourceMappingURL=game.js.map
