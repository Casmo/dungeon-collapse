class DungeonBuilder {
    width: number;
    height: number;
    constructor(w:number,h:number,p1:Player,p2:Player) {
        this.width = w;
        this.height = h;
    }
    build(): Grid<DungeonTile> {
        var map = new Grid<DungeonTile>(this.width, this.height);
        for (var i = 0; i < Math.floor(this.width/2); i++) {
            map.Cells[i] = new Array<DungeonTile>();
            for (var j = 0; j < map.Height; j++) {
                var tile = DungeonTile.random(i, j);
                map.Set(i, j, tile);
                var mirror = tile.clone();
                mirror.posX = (this.width - 1) - i;
                map.Set((this.width-1)-i, j, mirror);
            }
        }
        return map;
    }
} 