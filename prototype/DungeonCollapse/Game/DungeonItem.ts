/// <reference path="_reference.ts" />
class DungeonItem {
    name: string;
    effect: string;
    toString() {
        return "?";
    }
    clone(): DungeonItem{
        var di: DungeonItem = new DungeonItem();
        di.name = this.name;
        di.effect = this.effect;
        return di;
    }
}