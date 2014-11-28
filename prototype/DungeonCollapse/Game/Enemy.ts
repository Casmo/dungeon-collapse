class Enemy extends Character{
    strength: number;
    constructor(view: string) {
        super(view);
    }
    clone() {
        var c = new Enemy(this.view);
        c.health = this.health;
        c.setPos(this.posX, this.posY);
        c.name = this.name;
        c.strength = this.strength;
        return c;
    }
}  