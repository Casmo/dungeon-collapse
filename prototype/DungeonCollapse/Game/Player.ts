/// <reference path="_reference.ts" />
class Player {
    characters: Array<Character>;  
    mappedTiles: Array<DungeonTile>;
    currentCharacter: Character;
    name: string;
    constructor(charViews: string) {
        this.name = charViews;
        this.mappedTiles = new Array<DungeonTile>();
        this.characters = new Array<Character>();
        this.characters.push(new Character(charViews.charAt(0)));
        this.characters.push(new Character(charViews.charAt(1)));
        this.currentCharacter = this.characters[0];
    }
    nextTurn() {
        if (this.currentCharacter.actionsLeft == 0) {
            this.currentCharacter.actionsLeft = 2;
            var i = this.characters.indexOf(this.currentCharacter);
            this.currentCharacter = this.characters[(i + 1) % this.characters.length];
            return true;
        }
        else
            return false;
    }
    setupCharacters(side: string, map: Grid<DungeonTile>) {
        for (var i = 0; i < this.characters.length; i++) {
            this.characters[i].posY = i;
            if (side == "left") {
                this.characters[i].posX = 0;
            }
            else {
                this.characters[i].posX = map.Width-1;
            }
            map.Get(this.characters[i].posX, this.characters[i].posY).character = this.characters[i];

        }
    }
    mapTile(tile: DungeonTile) {
        if (this.mappedTiles.indexOf(tile) == -1) {
            this.mappedTiles.push(tile);
        }
    }
} 