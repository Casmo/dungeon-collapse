/// <reference path="_reference.ts" />
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
        this.currentDungeon = new Dungeon(7, 13);
        this.player1 = new Player(0,0,"1");
        this.player2 = new Player(0, 12, "2");
        this.currentPlayer = this.player1;
        var self = this;
        document.addEventListener('keydown', function (event) {
            self.handleKey(event.keyCode);
        });
    }
    handleKey(keyCode: number) {
        var direction = -1;
        switch (keyCode) {
            case 37: direction = 1; break;
            case 38: direction =0; break;
            case 39: direction = 3; break;
            case 40: direction = 2; break;
        }
        if (direction >= 0) {
            this.currentDungeon.movePlayer(this.currentPlayer, direction);
            this.nextTurn();
        }
    }
    draw() {
        this.element.innerHTML = this.currentDungeon.toString(this.player1, this.player2);
    }
    nextTurn() {
        this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
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