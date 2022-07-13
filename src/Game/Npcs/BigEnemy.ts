import { Graphics, Rectangle, Texture } from "pixi.js";
import { Tween } from "tweedle.js";
import { PhysicsContainer } from "../PhysicsContainer";
import { InterHitbox } from "../Utils/InterHitbox";
import { InterUpdateable } from "../Utils/InterUpdateable";
import { StateAnimations } from "../Utils/StateAnimations";


export class BigEnemy extends PhysicsContainer implements InterUpdateable, InterHitbox {

    private enemyShip: StateAnimations;
    private hitbox: Graphics;
    private static readonly MOVE_SPEED = 75;
    private health = 50;
    public bigEnemyDead: boolean = false;
    public bigShooting = false;

    constructor() {

        super();
        this.enemyShip = new StateAnimations();
        this.enemyShip.addState("bigIdleEnemy1", [Texture.from("Big1.png")], 1);
        this.enemyShip.addState("bigIdleEnemy2", [Texture.from("Big2.png")], 1);
        this.enemyShip.addState("bigIdleEnemy3", [Texture.from("Big3.png")], 1);
        this.enemyShip.addState("BigEnemyExplode", [
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
        switch (Math.floor((Math.random()*3)+1)) {
            case 1:
                this.enemyShip.playState("bigIdleEnemy1");
                this.hitbox = new Graphics();
                this.hitbox.beginFill(0x0000FF, 1);
                this.hitbox.drawRect(-17.5,-40,35,80);
                this.hitbox.endFill();
                break;
        
            case 2:
                this.enemyShip.playState("bigIdleEnemy2");
                this.hitbox = new Graphics();
                this.hitbox.beginFill(0x0000FF, 1);
                this.hitbox.drawRect(-20,-45,40,90);
                this.hitbox.endFill();
                break;
        
            case 3:
                this.enemyShip.playState("bigIdleEnemy3");
                this.hitbox = new Graphics();
                this.hitbox.beginFill(0x0000FF, 1);
                this.hitbox.drawRect(-65,-10,130,20);
                this.hitbox.endFill();
                break;
        
            default:
                this.enemyShip.playState("bigIdleEnemy1");
                this.hitbox = new Graphics();
                this.hitbox.beginFill(0x0000FF, 1);
                this.hitbox.drawRect(-17.5,-40,35,80);
                this.hitbox.endFill();
                break;
        }
        this.enemyShip.rotation = Math.PI/2;

        this.addChild(this.enemyShip);

        this.speed.x = -BigEnemy.MOVE_SPEED;
        this.speed.y = BigEnemy.MOVE_SPEED * (Math.random() < 0.5 ? -1 : 1);

        this.enemyShip.addChild(this.hitbox);
        this.addChild(this.enemyShip);
        this.scale.set(2.5);

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
            this.scale.set(1);
            this.enemyShip.removeChild(this.hitbox);
            this.enemyShip.playState("BigEnemyExplode");
            new Tween(this).
            to({scale: {x:0.05, y:0.05}}, 400).
            onComplete(()=>{this.bigEnemyDead = true}).
            start();
        }
    }
    public respawn() {
        this.health = 50;
        switch (Math.floor((Math.random()*3)+1)) {
            case 1:
                this.enemyShip.playState("bigIdleEnemy1");
                this.hitbox.clear();
                this.hitbox.beginFill(0x0000FF, 1);
                this.hitbox.drawRect(-17.5,-40,35,80);
                this.hitbox.endFill();
                break;
        
            case 2:
                this.enemyShip.playState("bigIdleEnemy2");
                this.hitbox.clear();
                this.hitbox.beginFill(0x0000FF, 1);
                this.hitbox.drawRect(-20,-45,40,90);
                this.hitbox.endFill();
                break;
        
            case 3:
                this.enemyShip.playState("bigIdleEnemy3");
                this.hitbox.clear();
                this.hitbox.beginFill(0x0000FF, 1);
                this.hitbox.drawRect(-65,-10,130,20);
                this.hitbox.endFill();
                break;
        
            default:
                this.enemyShip.playState("bigIdleEnemy1");
                this.hitbox.clear();
                this.hitbox.beginFill(0x0000FF, 1);
                this.hitbox.drawRect(-17.5,-40,35,80);
                this.hitbox.endFill();
                break;
        }
        this.speed.x = -BigEnemy.MOVE_SPEED;
        this.scale.set(2.5);
        this.enemyShip.addChild(this.hitbox);
        this.bigEnemyDead = false;
    }

}