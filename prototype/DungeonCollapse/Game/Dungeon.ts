/// <reference path="_reference.ts" />
class Dungeon {
    width: number;
    height: number;
    player1: Player;
    player2: Player;
    grid: Array<Array<DungeonTile>>;
    constructor(w:number,h:number,p1:Player,p2:Player) {
        this.width = w;
        this.height = h;
        this.player1 = p1;
        this.player2 = p2;

        this.grid = new Array<Array<DungeonTile>>();
        for (var i = 0; i < this.width; i++) {
            this.grid[i] = new Array<DungeonTile>();
            for (var j = 0; j < this.height; j++) {
                this.grid[i][j] = DungeonTile.random(i,j);
            }
        }
        this.player1.clearTile(this.grid[this.player1.posX][this.player1.posY]);
        this.player2.clearTile(this.grid[this.player2.posX][this.player2.posY]);
    }
    movePlayer(player: Player, direction: number) {
        var targetX = player.posX + directions[direction].x;
        var targetY = player.posY + directions[direction].y;        
        if (this.validPosition(targetX, targetY)) {
            var tile = this.grid[targetX][targetY];
            var otherPlayer: Player = this.getOtherPlayer(player);
            if (!tile.passable || (otherPlayer.posX == tile.posX && otherPlayer.posY == tile.posY)) {
                player.clearTile(tile);
            }
            else
                player.moveToTile(tile);
        }

    }
    validPosition(x: number, y: number): boolean {
        return (x >= 0 && x < this.width && y >= 0 && y < this.height);
    }
    handlePlayerAction(player: Player, action: string, targetX: number, targetY: number) {

    }
    getOtherPlayer(player: Player): Player  {
        return (player == this.player1) ? this.player1 : this.player2;
    }
    toString(player:Player) {
        var str = "";
        var otherPlayer: Player = this.getOtherPlayer(player);
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                if (player.posX == i && player.posY == j) {
                    str += player.view;
                }
                else if (player.mappedTiles.indexOf(this.grid[i][j]) != -1) {
                    if (otherPlayer.posX == i && otherPlayer.posY == j) {
                        str += otherPlayer.view;
                    }
                    else
                        str += this.grid[i][j].toString();
                }
                else {
                    str += "#"; 
                }
                             
            }
            str += "</br>";
        }
        return str;
    }
} 
