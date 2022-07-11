import { Graphics, Rectangle, Texture } from "pixi.js";
import { Tween } from "tweedle.js";
import { PhysicsContainer } from "../PhysicsContainer";
import { InterHitbox } from "../Utils/InterHitbox";
import { InterUpdateable } from "../Utils/InterUpdateable";
import { StateAnimations } from "../Utils/StateAnimations";


export class EnemyShip extends PhysicsContainer implements InterUpdateable, InterHitbox {

    private enemyShip: StateAnimations;
    private hitbox: Graphics;
    private static readonly MOVE_SPEED = 75;
    private health = 50;
    public enemyDead: boolean = false;
    public shooting = false;

    constructor() {

        super();
        this.enemyShip = new StateAnimations();
        this.enemyShip.addState("idleEnemy", [Texture.from("Boss1")], 1);
        this.enemyShip.addState("enemyExplode", [
           "Explosion_1.png",
           "Explosion_2.png",
           "Explosion_3.png",
           "Explosion_4.png",
           "Explosion_5.png",
           "Explosion_6.png",
           "Explosion_7.png",
           "Explosion_8.png",
           "Explosion_9.png",
           "Explosion_10.png",
        ], 0.25, false);
        this.enemyShip.playState("idleEnemy");
        this.enemyShip.rotation = 3*Math.PI/2;

        this.addChild(this.enemyShip);

        this.hitbox = new Graphics();
        this.hitbox.beginFill(0x0000FF, 0);
        this.hitbox.drawRect(-50,-100,100,200);
        this.hitbox.endFill();

        this.speed.x = -EnemyShip.MOVE_SPEED;
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
    public receiveDamage(damage: number) {
        this.health -= damage;
        if (this.health <= 0) {
            this.speed.set(0);
            this.enemyShip.removeChild(this.hitbox);
            this.enemyShip.playState("enemyExplode");
            new Tween(this).
            to({scale: {x:0.05, y:0.05}}, 400).
            onComplete(()=>{this.enemyDead = true}).
            start();
        }
    }
    public respawn() {
        this.health = 50;
        this.enemyShip.playState("idleEnemy");
        this.enemyDead = false;
    }

}