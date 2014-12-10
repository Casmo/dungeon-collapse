class Enemy extends Character{
    constructor(view: string) {
        this.type="enemy";
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
    onDeath() {
        log.write(this.name + " died.");
    }
    attackPC(pc: PlayerCharacter) {
        pc.health -= this.strength;
        pc.onDefend();
    }
}  