/// <reference path="_reference.ts" />
class DungeonTile {
    passable: boolean;
    destructible: boolean;
    type: string;
    description: string;
    items: Array<DungeonItem>;
    posX: number;
    posY: number;
    character: Character;

    constructor(type: string, x: number=-1, y: number=-1) {
        this.posX = x;
        this.posY = y;
        this.type = type;
        this.character = null;
        this.items = new Array<DungeonItem>();
    }
    clone():DungeonTile {
        var cl = new DungeonTile(this.type, this.posX, this.posY);
        cl.description = this.description;
        cl.passable = this.passable;
        for (var i = 0; i < this.items.length; i++) {
            cl.addItem(this.items[i].clone());
        }
        if (this.character != null) {
            var enemy: Enemy = <Enemy>(this.character);
            cl.character = enemy.clone();
        }

        return cl;
    }
    setupForCharacter(ch: Character) {
        this.character = ch;
        this.passable = true;
        this.items = new Array<DungeonItem>();
    }
    addItem(item: DungeonItem) {
        this.items.push(item);
    }
    canEnter() { 
        return this.passable && this.character == null;
    }
    toString() {
        if (!this.passable) {
            return "X";
        }
        if (this.character != null) {
            return this.character.view;
        }
        if (this.items.length > 0) {
            return this.items[0].toString();
        }
        return ".";
    }
    static random(x:number,y:number): DungeonTile {
        var tile = new DungeonTile("basic",x,y);
        tile.passable = Math.random() > 0.1;
        if (Math.random() < 0.3) {
            tile.addItem(new DungeonItem());
        }
        else if (Math.random() < 0.2) {
            tile.character = new Enemy("V");
        }
        return tile;
    }
}