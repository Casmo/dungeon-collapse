var Game = (function () {
    function Game(element) {
        this.element = element;
    }
    Game.prototype.start = function () {
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
//# sourceMappingURL=app.js.map
