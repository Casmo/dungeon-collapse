class Game {
    element: HTMLElement;
    constructor(element: HTMLElement) {
        this.element = element;
    }

    start() {
       
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