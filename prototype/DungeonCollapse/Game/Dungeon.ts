/// <reference path="_reference.ts" />
class Dungeon {
    p1: Player;
    p2: Player;
    map: Grid<DungeonTile>;
    cp: Player;
    constructor(p1:Player,p2:Player,map:Grid<DungeonTile>) {
        this.p1 = p1;
        this.p2 = p2;
        this.cp = p1;
        this.map = map;
        this.p1.setupCharacters("left", this.map);
        this.p2.setupCharacters("right", this.map);
        for (var i = 0; i < this.p1.characters.length; i++) {
            var pc1 = this.p1.characters[i];
            var pc2 = this.p2.characters[i];
            this.p1.mapTile(this.map.Get(pc1.posX, pc1.posY));
            this.p2.mapTile(this.map.Get(pc2.posX, pc2.posY));
        }

    }
    nextTurn() {
        var characterDone = this.cp.nextTurn();
        if (characterDone) {
            this.cp = this.cp === this.p1 ? this.p2 : this.p1;
        }        
    }
    handleInput(input) {
        if (!isNaN(parseFloat(input)) && isFinite(input)) {
            //its a direction
            this.moveCharacter(this.cp.currentCharacter, input);
        }
        else {
            //its something else

        }
    }

    moveCharacter(character: Character, direction: number) {       
        var targetX = character.posX + directions[direction].x;
        var targetY = character.posY + directions[direction].y; 
        
        if (this.map.Inside(targetX, targetY)) {
            console.log(character.view, character.posX, character.posY, targetX, targetY, this.map.Get(targetX, targetY).posX, this.map.Get(targetX, targetY).posY);               
            var tile = this.map.Get(targetX, targetY);
            if (tile.canEnter()) {
                this.moveCharacterToTile(character, tile);
            }
            else {
                this.cp.mapTile(tile);
            } 
            this.cp.currentCharacter.actionsLeft--;           
        }
    }
    moveCharacterToTile(ch: Character, tile: DungeonTile) {
        
        this.map.Get(ch.posX, ch.posY).character = null;
        ch.moveToTile(tile);
        tile.character = ch;        
        this.cp.mapTile(tile);
    }

    handlePlayerAction(player: Player, action: string, targetX: number, targetY: number) {

    }

    toString(mappedTiles:Array<DungeonTile>) {
        var str = this.cp.name + " - " + this.cp.currentCharacter.view + "</br>";
        for (var i = 0; i < this.map.Height; i++) {
            for (var j = 0; j < this.map.Width; j++) {
                var chr = "#";
                if (mappedTiles.indexOf(this.map.Get(j, i)) != -1) {
                    chr = this.map.Get(j, i).toString();
                }                
                str += chr;
            }
            str += "</br>";
        }
        return str;
    }

} 
