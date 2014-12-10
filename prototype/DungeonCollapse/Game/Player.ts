/// <reference path="_reference.ts" />
class Player {
    characters: Array<PlayerCharacter>;  
    mappedTiles: Array<DungeonTile>;
    currentCharacter: PlayerCharacter;
    name: string;
    gold: number;
    constructor(charViews: string) {
        this.name = charViews;
        this.mappedTiles = new Array<DungeonTile>();
        this.characters = new Array<PlayerCharacter>();
        this.characters.push(new PlayerCharacter(charViews.charAt(0)));
        this.characters.push(new PlayerCharacter(charViews.charAt(1)));
        this.currentCharacter = this.characters[0];
        this.gold = 0;
    }
    nextCharacter() { 
        var i = this.characters.indexOf(this.currentCharacter);
        this.currentCharacter = this.characters[(i + 1) % this.characters.length];
    }
    setupCharacters(side: string, map: Grid<DungeonTile>) {
        for (var i = 0; i < this.characters.length; i++) {
            //put characters under each other on the given side of the room
            this.characters[i].posY = i;
            if (side == "left") {
                this.characters[i].posX = 0;
            }
            else {
                this.characters[i].posX = map.Width-1;
            }
            //put characters on tile and map the tile
            var tile = map.Get(this.characters[i].posX, this.characters[i].posY);
            tile.setupForCharacter(this.characters[i]);
            this.mappedTiles.push(tile);
        }
    }

    mapTile(tile: DungeonTile) {
        if (this.mappedTiles.indexOf(tile) == -1) {
            this.currentCharacter.mapTile(tile);
            this.mappedTiles.push(tile);
        }
    }
} 