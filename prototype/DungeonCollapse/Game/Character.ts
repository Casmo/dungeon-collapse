/// <reference path="_reference.ts" />
class Character {
    view: string;
    name: string;
    health: number;
    posX: number;
    posY: number;
    constructor(view: string) {
        this.health = 100;
        this.view = view; 
        this.name = this.view;    
    }
    setPos(x: number, y: number) {
        this.posX = x;
        this.posY = y;
    }

} 
