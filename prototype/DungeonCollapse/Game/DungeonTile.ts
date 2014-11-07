/// <reference path="_reference.ts" />
class DungeonTile {
    invisible: boolean;
    passable: boolean;
    destructible: boolean;
    type: string;
    description: string;
    items: Array<DungeonItem>;
    posX: number;
    posY: number;

    constructor(type: string, x: number=-1, y: number=-1) {
        this.posX = x;
        this.posY = y;
        this.invisible = false;
        this.type = type;
        this.items = new Array<DungeonItem>();
    }
    addItem(item: DungeonItem) {
        this.items.push(item);
    }

    toString() {
        if (!this.passable) {
            return "0";
        }
        if (this.items.length > 0) {
            return this.items[0].toString();
        }
        return ".";
    }
    static random(x:number,y:number): DungeonTile {
        var tile = new DungeonTile("basic",x,y);
        tile.passable = Math.random() > 0.2;
        if (Math.random() < 0.3) {
            tile.addItem(new DungeonItem());
        }
        return tile;
    }

}