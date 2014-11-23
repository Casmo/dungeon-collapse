﻿/// <reference path="_reference.ts" />
class Game {
    element: HTMLElement;
    currentDungeon: Dungeon;
    player1: Player;
    player2: Player;
    currentPlayer: Player;
    constructor(element: HTMLElement) {
        this.element = element;        
    }

    setup() {        
        this.player1 = new Player("ab");
        this.player2 = new Player("12");
        var map = new DungeonBuilder(18, 7, this.player1, this.player2).build();
        this.currentDungeon = new Dungeon(this.player1, this.player2,map);
        this.currentPlayer = this.player1;
        var self = this;
        document.addEventListener('keydown', function (event) {
            self.handleKey(event.keyCode);
        });
    }
    handleKey(keyCode: number) {
        var direction = -1;
        switch (keyCode) {
            case 37: direction = 0; break;
            case 38: direction =1; break;
            case 39: direction = 2; break;
            case 40: direction = 3; break;
        }
        if (direction >= 0) {
            this.currentDungeon.handleInput(direction);
            this.nextTurn();
        }
        else {
            this.nextTurn();
        }
    }
    draw() {
        this.element.innerHTML = this.currentDungeon.toString(this.currentDungeon.cp.mappedTiles);
    }

    nextTurn() {
        this.currentDungeon.nextTurn();
        this.draw();
    }
    start() {
        this.setup();
        this.draw();
    }

    stop() {
       
    }
}

var game: Game;
enum Direction {LEFT, UP, RIGHT, DOWN };
var directions = [{ x: -1, y: 0 },{ x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }];

window.onload = () => {
    var el = document.getElementById('content');
    game = new Game(el);
    game.start();
};