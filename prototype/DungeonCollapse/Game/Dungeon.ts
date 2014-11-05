/// <reference path="_reference.ts" />



class Dungeon {
    width: number;
    height: number;
    grid: Array<Array<DungeonTile>>;
    constructor(w:number,h:number) {
        this.width = w;
        this.height = h;
        this.grid = new Array<Array<DungeonTile>>();
        for (var i = 0; i < this.width; i++) {
            this.grid[i] = new Array<DungeonTile>();
            for (var j = 0; j < this.height; j++) {
                this.grid[i][j] = DungeonTile.random();
            }
        }
    }
    movePlayer(player: Player, direction: number) {
        var targetX = player.posX + directions[direction].x;
        var targetY = player.posY + directions[direction].y;
        if (this.validPosition(targetX, targetY)) {
            player.posX = targetX;
            player.posY = targetY;
        }

    }
    validPosition(x: number, y: number, mustBePassable: boolean= true): boolean {
        var safe = (x >= 0 && x < this.width && y >= 0 && y < this.height);
        if (mustBePassable) {
            return safe && this.grid[x][y].passable;
        }
        return safe;
    }
    handlePlayerAction(player: Player, action: string, targetX: number, targetY: number) {

    }
    toString(p1:Player,p2:Player) {
        var str = "";
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                if (i == p1.posX && j == p1.posY) {
                    str += p1.view;
                }
                else if (i == p2.posX && j == p2.posY) {
                    str += p2.view;
                }
                else {
                    str += this.grid[i][j].toString();
                }
                
            }
            str += "</br>";
        }
        return str;
    }
} 
