/// <reference path="_reference.ts" />
class Game {
    element: HTMLElement;
    currentDungeon: Dungeon;
    constructor(element: HTMLElement) {
        this.element = element;
        this.setup();
    }
    setup() {
        this.currentDungeon = new Dungeon(7,13);
    }
    start() {
        this.element.innerHTML = this.currentDungeon.toString();
    }

    stop() {
       
    }
}

var game: Game;
window.onload = () => {
    var el = document.getElementById('content');
    game = new Game(el);
    game.start();
};