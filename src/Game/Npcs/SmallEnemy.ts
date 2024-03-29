import { sound } from "@pixi/sound";
import { Graphics, Rectangle, Texture } from "pixi.js";
import { Tween } from "tweedle.js";
import { PhysicsContainer } from "../PhysicsContainer";
import { InterHitbox } from "../Utils/InterHitbox";
import { InterUpdateable } from "../Utils/InterUpdateable";
import { StateAnimations } from "../Utils/StateAnimations";


export class SmallEnemy extends PhysicsContainer implements InterUpdateable, InterHitbox {
    
    private enemyShip: StateAnimations;
    private hitbox: Graphics;
    public static readonly MOVE_SPEED = 150;
    private health = 10;
    public smallEnemyDead = false;
    public smallShooting = false;
    private enemyType: number = 0;

    constructor(level: number) {

        super();
        this.enemyShip = new StateAnimations();
        this.enemyShip.addState("smallIdleEnemy1", [Texture.from("Small1.png")], 1);
        this.enemyShip.addState("smallIdleEnemy2", [Texture.from("Small2.png")], 1);
        this.enemyShip.addState("smallIdleEnemy3", [Texture.from("Small3.png")], 1);
        this.enemyShip.addState("smallIdleEnemy4", [Texture.from("Small4.png")], 1);
        this.enemyShip.addState("smallIdleEnemy5", [Texture.from("Small5.png")], 1);
        this.enemyShip.addState("smallIdleEnemy6", [Texture.from("Small6.png")], 1);
        this.enemyShip.addState("smallEnemyExplode", [
           "SmallExplosion_1.png",
           "SmallExplosion_2.png",
           "SmallExplosion_3.png",
           "SmallExplosion_4.png",
           "SmallExplosion_5.png",
           "SmallExplosion_6.png",
           "SmallExplosion_7.png",
           "SmallExplosion_8.png",
           "SmallExplosion_9.png",
           "SmallExplosion_10.png",
        ], 0.25, false);
        if (level == 1) {
            this.enemyType = Math.floor((Math.random()*3)+1);
        } else if (level == 2) {
            this.enemyType = Math.floor((Math.random()*3)+4);
        }
        switch (this.enemyType) {
            case 1:
                this.enemyShip.playState("smallIdleEnemy1");
                this.hitbox = new Graphics();
                this.hitbox.beginFill(0x0000FF, 0);
                this.hitbox.drawRect(-7,-10,14,20);
                this.hitbox.endFill();
                break;
        
            case 2:
                this.enemyShip.playState("smallIdleEnemy2");
                this.hitbox = new Graphics();
                this.hitbox.beginFill(0x0000FF, 0);
                this.hitbox.drawRect(-8,-10,16,20);
                this.hitbox.endFill();
                break;
        
            case 3:
                this.enemyShip.playState("smallIdleEnemy3");
                this.hitbox = new Graphics();
                this.hitbox.beginFill(0x0000FF, 0);
                this.hitbox.drawRect(-10,-10,20,20);
                this.hitbox.endFill();
                break;
        
            case 4:
                this.enemyShip.playState("smallIdleEnemy4");
                this.hitbox = new Graphics();
                this.hitbox.beginFill(0x0000FF, 0);
                this.hitbox.drawRect(-10,-5,20,10);
                this.hitbox.endFill();
                break;
        
            case 5:
                this.enemyShip.playState("smallIdleEnemy5");
                this.hitbox = new Graphics();
                this.hitbox.beginFill(0x0000FF, 0);
                this.hitbox.drawRect(-11,-5,22,10);
                this.hitbox.endFill();
                break;
        
            case 6:
                this.enemyShip.playState("smallIdleEnemy6");
                this.hitbox = new Graphics();
                this.hitbox.beginFill(0x0000FF, 0);
                this.hitbox.drawRect(-12.5,-5,25,10);
                this.hitbox.endFill();
                break;
        
            default:
                this.enemyShip.playState("smallIdleEnemy1");
                this.hitbox = new Graphics();
                this.hitbox.beginFill(0x0000FF, 0);
                this.hitbox.drawRect(-7,-10,14,20);
                this.hitbox.endFill();
                break;
        }
        this.enemyShip.rotation = Math.PI/2;

        this.addChild(this.enemyShip);

        this.speed.x = -SmallEnemy.MOVE_SPEED;
        this.speed.y = SmallEnemy.MOVE_SPEED * (Math.random() < 0.5 ? -1 : 1);

        this.enemyShip.addChild(this.hitbox);
        this.addChild(this.enemyShip);
        this.scale.set(1.5);

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
            const explosion = sound.find("EnemyExplosion");
            explosion.play({volume: 0.05, singleInstance: true});
            this.speed.set(0);
            this.scale.set(0.50);
            this.enemyShip.removeChild(this.hitbox);
            this.enemyShip.playState("smallEnemyExplode");
            new Tween(this).
            to({scale: {x:0.05, y:0.05}}, 400).
            onComplete(()=>{this.smallEnemyDead = true}).
            start();
        }
    }
    
    public respawn() {
        this.health = 10;
        if (this.enemyType < 4) {
            this.enemyType = Math.floor((Math.random()*3)+1);
        } else {
            this.enemyType = Math.floor((Math.random()*3)+4);
        }
        switch (this.enemyType) {
            case 1:
                this.enemyShip.playState("smallIdleEnemy1");
                this.hitbox.clear();
                this.hitbox.beginFill(0x0000FF, 0);
                this.hitbox.drawRect(-7,-10,14,20);
                this.hitbox.endFill();
                break;
        
            case 2:
                this.enemyShip.playState("smallIdleEnemy2");
                this.hitbox.clear();
                this.hitbox.beginFill(0x0000FF, 0);
                this.hitbox.drawRect(-8,-10,16,20);
                this.hitbox.endFill();
                break;
        
            case 3:
                this.enemyShip.playState("smallIdleEnemy3");
                this.hitbox.clear();
                this.hitbox.beginFill(0x0000FF, 0);
                this.hitbox.drawRect(-10,-10,20,20);
                this.hitbox.endFill();
                break;
                case 4:
                this.enemyShip.playState("smallIdleEnemy4");
                this.hitbox = new Graphics();
                this.hitbox.beginFill(0x0000FF, 0);
                this.hitbox.drawRect(-10,-5,20,10);
                this.hitbox.endFill();
                break;
        
            case 5:
                this.enemyShip.playState("smallIdleEnemy5");
                this.hitbox = new Graphics();
                this.hitbox.beginFill(0x0000FF, 0);
                this.hitbox.drawRect(-11,-5,22,10);
                this.hitbox.endFill();
                break;
        
            case 6:
                this.enemyShip.playState("smallIdleEnemy6");
                this.hitbox = new Graphics();
                this.hitbox.beginFill(0x0000FF, 0);
                this.hitbox.drawRect(-12.5,-5,25,10);
                this.hitbox.endFill();
                break;
        
        
            default:
                this.enemyShip.playState("smallIdleEnemy1");
                this.hitbox.clear();
                this.hitbox.beginFill(0x0000FF, 0);
                this.hitbox.drawRect(-7,-10,14,20);
                this.hitbox.endFill();
                break;
        }
        this.speed.x = -SmallEnemy.MOVE_SPEED;
        this.scale.set(1.5);
        this.enemyShip.addChild(this.hitbox);
        this.smallEnemyDead = false;
    }

}