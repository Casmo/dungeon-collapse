﻿/// <reference path="_reference.ts" />
class Dungeon {
    p1: Player;
    p2: Player;
    map: Grid<DungeonTile>;
    cp: Player; //currentPlayer
    constructor(p1:Player,p2:Player,map:Grid<DungeonTile>) {
        this.p1 = p1;
        this.p2 = p2;
        this.cp = p1;
        this.map = map;
        //setup characters on each side of the map
        this.p1.setupCharacters("left", this.map);
        this.p2.setupCharacters("right", this.map);
    }
    nextTurn() {        
        if (this.cp.currentCharacter.actionsLeft <= 0) {
            log.write("next turn");
            this.cp.currentCharacter.onTurnEnd();
            //change current player
            this.cp = this.cp === this.p1 ? this.p2 : this.p1;
            //change that player's character
            this.cp.nextCharacter();
            this.cp.currentCharacter.onTurnStart();
        }        
    }
    handleInput(input) {
        if (!isNaN(parseFloat(input)) && isFinite(input) && input >=0) {
            //its a number, so a direction
            this.moveCharacter(this.cp.currentCharacter, input);
            this.nextTurn();
        }
        else {
            this.cp.currentCharacter.wait();
            this.nextTurn();

            //its something else
        }
    }

    moveCharacter(character: Character, direction: number) {       
        var targetX = character.posX + directions[direction].x;
        var targetY = character.posY + directions[direction].y; 
        
        if (this.map.Inside(targetX, targetY)) {
            var tile = this.map.Get(targetX, targetY);

            if (this.cp.mappedTiles.indexOf(tile) == -1) {
                this.cp.mapTile(tile);
            }
            else {
                if (tile.canEnter()) {
                    this.moveCharacterToTile(character, tile);
                }
            }              
        }
    }
    moveCharacterToTile(ch: Character, tile: DungeonTile) {
        //move character and change the map accordingly
        this.map.Get(ch.posX, ch.posY).character = null;
        ch.moveToTile(tile);
        tile.character = ch;              
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
