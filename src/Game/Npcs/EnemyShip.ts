import { Graphics, Rectangle, Texture } from "pixi.js";
import { PhysicsContainer } from "../PhysicsContainer";
import { InterHitbox } from "../Utils/InterHitbox";
import { InterUpdateable } from "../Utils/InterUpdateable";
import { StateAnimations } from "../Utils/StateAnimations";


export class EnemyShip extends PhysicsContainer implements InterUpdateable, InterHitbox {

    private enemyShip: StateAnimations;
    private hitbox: Graphics;
    private static readonly MOVE_SPEED = 100;
    private health = 50;

    constructor() {

        super();
        this.enemyShip = new StateAnimations();
        this.enemyShip.addState("idleEnemy", [Texture.from("Boss1")], 1);
        this.enemyShip.playState("idleEnemy");
        this.enemyShip.rotation = 3*Math.PI/2;

        this.addChild(this.enemyShip);

        this.hitbox = new Graphics();
        this.hitbox.beginFill(0x0000FF, 0);
        this.hitbox.drawRect(-50,-100,100,200);
        this.hitbox.endFill();

        this.speed.y = EnemyShip.MOVE_SPEED * (Math.random() < 0.5 ? -1 : 1);

        this.enemyShip.addChild(this.hitbox);
        this.addChild(this.enemyShip);

    }

    public override update(deltaMS: number) {

        super.update(deltaMS / 60);
        this.enemyShip.updateAnim(deltaMS);

    }

    public getHitbox(): Rectangle {
        return this.hitbox.getBounds();
    }
    public changeSpeed() {
        this.speed.y = -this.speed.y;
    }
    public receiveDamage(damage: number) {
        this.health -= damage;
    }
    public isDead(): boolean {
        if (this.health<=0) {
            return true;
        } else {
            return false;
        }
    }
    public explode() {
        this.enemyShip.playState("explode");
        this.destroy();
    }

}