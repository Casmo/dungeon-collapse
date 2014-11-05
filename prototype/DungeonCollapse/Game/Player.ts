/// <reference path="_reference.ts" />
class Player {
    view: string;
    health: number;
    posX: number;
    posY: number;
    
    constructor(startX: number, startY: number,view:string) {
        this.posX = startX;
        this.posY = startY;
        this.health = 100;
        this.view = view;

    }
} 