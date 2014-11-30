/// <reference path="_reference.ts" />
class Character {
    view: string;
    name: string;
    health: number;
    strength: number;
    posX: number;
    posY: number;
    type: string;
    constructor(view: string) {
        this.health = 40;
        this.strength = 5;
        this.view = view; 
        this.name = this.view;    
    }
    setPos(x: number, y: number) {
        this.posX = x;
        this.posY = y;
    }
} 
