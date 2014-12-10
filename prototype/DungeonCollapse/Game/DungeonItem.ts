/// <reference path="_reference.ts" />
class DungeonItem {
    name: string;
    effect: string;
    gold: number;
    constructor() {
        this.gold = 1 + Math.round(Math.random() * 5);
    }
    toString() {
        return "?";
    }
    onPickup() {
        log.write(game.currentPlayer.currentCharacter.name + " picked up " + this.gold + " gold");
        game.currentPlayer.gold += this.gold;
    }
    onUse() {
    }
    clone(): DungeonItem{
        var di: DungeonItem = new DungeonItem();
        di.name = this.name;
        di.effect = this.effect;
        return di;
    }
}