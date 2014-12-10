/// <reference path="_reference.ts" />
var DungeonItem = (function () {
    function DungeonItem() {
        this.gold = 1 + Math.round(Math.random() * 5);
    }
    DungeonItem.prototype.toString = function () {
        return "?";
    };
    DungeonItem.prototype.onPickup = function () {
        log.write(game.currentPlayer.currentCharacter.name + " picked up " + this.gold + " gold");
        game.currentPlayer.gold += this.gold;
    };
    DungeonItem.prototype.onUse = function () {
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
        if (this.character != null) {
            var enemy = (this.character);
            cl.character = enemy.clone();
        }

        return cl;
    };
    DungeonTile.prototype.setupForCharacter = function (ch) {
        this.character = ch;
        this.passable = true;
        this.items = new Array();
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
        } else if (Math.random() < 0.2) {
            tile.character = new Enemy("V");
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
        this.characters.push(new PlayerCharacter(charViews.charAt(0)));
        this.characters.push(new PlayerCharacter(charViews.charAt(1)));
        this.currentCharacter = this.characters[0];
        this.gold = 0;
    }
    Player.prototype.nextCharacter = function () {
        var i = this.characters.indexOf(this.currentCharacter);
        this.currentCharacter = this.characters[(i + 1) % this.characters.length];
    };
    Player.prototype.setupCharacters = function (side, map) {
        for (var i = 0; i < this.characters.length; i++) {
            //put characters under each other on the given side of the room
            this.characters[i].posY = i;
            if (side == "left") {
                this.characters[i].posX = 0;
            } else {
                this.characters[i].posX = map.Width - 1;
            }

            //put characters on tile and map the tile
            var tile = map.Get(this.characters[i].posX, this.characters[i].posY);
            tile.setupForCharacter(this.characters[i]);
            this.mappedTiles.push(tile);
        }
    };

    Player.prototype.mapTile = function (tile) {
        if (this.mappedTiles.indexOf(tile) == -1) {
            this.currentCharacter.mapTile(tile);
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

        //setup characters on each side of the map
        this.p1.setupCharacters("left", this.map);
        this.p2.setupCharacters("right", this.map);
    }
    Dungeon.prototype.nextTurn = function () {
        if (this.cp.currentCharacter.actionsLeft <= 0) {
            log.write("next turn");
            this.cp.currentCharacter.onTurnEnd();

            //change current player
            this.cp = this.cp === this.p1 ? this.p2 : this.p1;

            //change that player's character
            this.cp.nextCharacter();
            this.cp.currentCharacter.onTurnStart();
        }
    };
    Dungeon.prototype.handleInput = function (input) {
        if (!isNaN(parseFloat(input)) && isFinite(input) && input >= 0) {
            //its a number, so a direction
            this.moveCharacter(this.cp.currentCharacter, input);
            this.nextTurn();
        } else {
            this.cp.currentCharacter.wait();
            this.nextTurn();
            //its something else
        }
    };

    Dungeon.prototype.moveCharacter = function (character, direction) {
        var targetX = character.posX + directions[direction].x;
        var targetY = character.posY + directions[direction].y;

        if (this.map.Inside(targetX, targetY)) {
            var tile = this.map.Get(targetX, targetY);

            if (this.cp.mappedTiles.indexOf(tile) == -1) {
                this.cp.mapTile(tile);
            } else if (tile.character != null) {
                // Combat!!!
                if (tile.character.type == 'enemy') {
                    var enemy = tile.character;
                    character.attackEnemy(enemy);
                    if (enemy.health <= 0) {
                        enemy.onDeath();
                        tile.character = null;
                    } else {
                        enemy.attackPC(character);
                    }
                } else if (tile.character.type == 'pc') {
                    var other = tile.character;
                    character.attackOpponent(other);
                    if (other.health > 0) {
                        other.attackOpponent(character);
                    }
                }
            } else if (tile.passable) {
                this.moveCharacterToTile(character, tile);
            }
        }
    };
    Dungeon.prototype.moveCharacterToTile = function (ch, tile) {
        //move character and change the map accordingly
        this.map.Get(ch.posX, ch.posY).character = null;
        ch.moveToTile(tile);
        tile.character = ch;
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
        this.player1 = new Player("ab");
        this.player2 = new Player("12");
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
        this.currentDungeon.handleInput(direction);
        this.draw();
    };
    Game.prototype.draw = function () {
        this.element.innerHTML = this.currentDungeon.toString(this.currentDungeon.cp.mappedTiles);
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
var log;
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
    game = new Game(document.getElementById('content'));
    log = new Log(document.getElementById('devlog'));
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
        this.health = 40;
        this.strength = 5;
        this.view = view;
        this.name = this.view;
    }
    Character.prototype.setPos = function (x, y) {
        this.posX = x;
        this.posY = y;
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
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Enemy = (function (_super) {
    __extends(Enemy, _super);
    function Enemy(view) {
        this.type = "enemy";
        _super.call(this, view);
    }
    Enemy.prototype.clone = function () {
        var c = new Enemy(this.view);
        c.health = this.health;
        c.setPos(this.posX, this.posY);
        c.name = this.name;
        c.strength = this.strength;
        return c;
    };
    Enemy.prototype.onDeath = function () {
        log.write(this.name + " died.");
    };
    Enemy.prototype.attackPC = function (pc) {
        pc.health -= this.strength;
        pc.onDefend();
    };
    return Enemy;
})(Character);
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
var Log = (function () {
    function Log(elem) {
        this.entries = new Array();
        this.html = elem;
    }
    Log.prototype.write = function (txt) {
        this.entries.push(txt);
        this.update(txt);
    };
    Log.prototype.update = function (txt) {
        this.html.innerHTML += txt + '</br>';
    };
    return Log;
})();
var PlayerCharacter = (function (_super) {
    __extends(PlayerCharacter, _super);
    function PlayerCharacter(view) {
        _super.call(this, view);
        this.type = 'pc';
        this.actionsLeft = 2;
        this.items = new Array();
        this.strength = 10;
        this.health = 100;
    }
    PlayerCharacter.prototype.moveToTile = function (tile) {
        log.write(this.view + " moved to " + tile.posX + "," + tile.posY);
        this.actionsLeft--;
        this.setPos(tile.posX, tile.posY);

        for (var i = 0; i < tile.items.length; i++) {
            var item = tile.items[i];
            item.onPickup();
            this.items.push(item);
        }
        tile.items = new Array();
    };
    PlayerCharacter.prototype.attackEnemy = function (enemy) {
        enemy.health -= this.strength;

        //apply effects
        this.actionsLeft--;
        log.write(this.name + " hits " + enemy.name + " for " + this.strength);
    };
    PlayerCharacter.prototype.attackOpponent = function (opp) {
        opp.health -= this.strength;

        //apply effects
        this.actionsLeft--;
        log.write(this.name + " hits " + opp.name + " for " + this.strength);
    };
    PlayerCharacter.prototype.mapTile = function (tile) {
        log.write(this.view + " mapped " + tile.posX + "," + tile.posY + " : " + tile.toString());
        this.actionsLeft--;
    };
    PlayerCharacter.prototype.onTurnStart = function () {
        this.actionsLeft = 2;
    };
    PlayerCharacter.prototype.onTurnEnd = function () {
    };
    PlayerCharacter.prototype.onDefend = function () {
    };
    PlayerCharacter.prototype.wait = function () {
        log.write(this.view + " waited");
        this.actionsLeft--;
    };
    return PlayerCharacter;
})(Character);
//# sourceMappingURL=game.js.map
