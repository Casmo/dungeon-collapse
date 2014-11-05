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
    toString() {
        var str = "";
        for (var i = 0; i < this.width; i++) {
            for (var j = 0; j < this.height; j++) {
                str += this.grid[i][j].toString();
            }
            str += "</br>";
        }
        return str;
    }
} 
