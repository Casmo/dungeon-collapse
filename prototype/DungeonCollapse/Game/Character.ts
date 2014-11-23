/// <reference path="_reference.ts" />
class Character {
    view: string;
    health: number;
    posX: number;
    posY: number;
    actionsLeft: number;
    constructor(view: string) {
        this.health = 100;
        this.view = view; 
        this.actionsLeft = 2;       
    }
    setPos(x: number, y: number) {
        this.posX = x;
        this.posY = y;
    }
    moveToTile(tile: DungeonTile) {
        this.setPos(tile.posX, tile.posY);
    }
} 