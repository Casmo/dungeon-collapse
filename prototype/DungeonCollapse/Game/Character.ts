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
        log.write(this.view + " moved to " + tile.posX + "," + tile.posY);
        this.actionsLeft--;
        this.setPos(tile.posX, tile.posY);
    }
    mapTile(tile: DungeonTile) {
        log.write(this.view + " mapped " + tile.posX + "," + tile.posY+" : "+tile.toString() );
        this.actionsLeft--;
    }
    onTurnStart() {
        this.actionsLeft = 2;
    }
    onTurnEnd() {
    }
    wait() {
        log.write(this.view + " waited");
        this.actionsLeft--;
    }
} 