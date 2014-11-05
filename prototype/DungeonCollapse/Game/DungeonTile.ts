/// <reference path="_reference.ts" />
class DungeonTile {
    invisible: boolean;
    passable: boolean;
    destructible: boolean;
    type: string;
    description: string;
    items: Array<DungeonItem>;

    constructor(type: string) {
        this.invisible = false;
        this.type = type;
        this.items = new Array<DungeonItem>();
    }
    addItem(item: DungeonItem) {
        this.items.push(item);
    }

    toString() {
        if (this.invisible) {
            return " ";
        }
        if (!this.passable) {
            return "#";
        }
        if (this.items.length > 0) {
            return this.items[0].toString();
        }
        return ".";
    }
    static random(): DungeonTile {
        var tile = new DungeonTile("basic");
        tile.passable = Math.random() > 0.3;
        if (Math.random() < 0.2) {
            tile.addItem(new DungeonItem());
        }
        return tile;
    }

}