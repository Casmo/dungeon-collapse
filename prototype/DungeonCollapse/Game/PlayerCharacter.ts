class PlayerCharacter extends Character {
    actionsLeft: number;
    items: Array<DungeonItem>;
    constructor(view: string) {
        super(view);
        this.type = 'pc';
        this.actionsLeft = 2;
        this.items = new Array<DungeonItem>();
        this.strength = 10;
        this.health = 100;
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
        log.write(this.view + " mapped " + tile.posX + "," + tile.posY + " : " + tile.toString());
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