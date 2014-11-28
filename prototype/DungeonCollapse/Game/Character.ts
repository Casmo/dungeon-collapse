/// <reference path="_reference.ts" />
class Character {
    view: string;
    name: string;
    health: number;
    posX: number;
    posY: number;
    actionsLeft: number;
    items: Array<DungeonItem>;
    constructor(view: string) {
        this.health = 100;
        this.view = view; 
        this.name = this.view;
        this.actionsLeft = 2; 
        this.items = new Array<DungeonItem>();      
    }
    setPos(x: number, y: number) {
        this.posX = x;
        this.posY = y;
    }
    moveToTile(tile: DungeonTile) {
        log.write(this.view + " moved to " + tile.posX + "," + tile.posY);
        this.actionsLeft--;
        this.setPos(tile.posX, tile.posY);
        //pick up items that are there
        for (var i = 0; i < tile.items.length; i++) {
            var item = tile.items[i];
            item.onPickup();
            this.items.push(item);
        }
        tile.items = new Array<DungeonItem>();
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