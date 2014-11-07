/// <reference path="_reference.ts" />
class Player {
    view: string;
    health: number;
    posX: number;
    posY: number;
    mappedTiles: Array<DungeonTile>;
    
    constructor(startX: number, startY: number,view:string) {
        this.posX = startX;
        this.posY = startY;
        this.health = 100;
        this.view = view;
        this.mappedTiles = new Array<DungeonTile>();
    }
    moveToTile(tile: DungeonTile) {
        this.posX = tile.posX;
        this.posY = tile.posY;
        this.mapTile(tile);
    }
    mapTile(tile: DungeonTile) {
        if (this.mappedTiles.indexOf(tile) == -1) {
            this.mappedTiles.push(tile);
        }
    }
    clearTile(tile: DungeonTile) {
        this.mapTile(tile);
    }
} 