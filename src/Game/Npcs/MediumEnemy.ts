import { sound } from "@pixi/sound";
import { Graphics, Rectangle, Texture } from "pixi.js";
import { Tween } from "tweedle.js";
import { PhysicsContainer } from "../PhysicsContainer";
import { InterHitbox } from "../Utils/InterHitbox";
import { InterUpdateable } from "../Utils/InterUpdateable";
import { StateAnimations } from "../Utils/StateAnimations";


export class MediumEnemy extends PhysicsContainer implements InterUpdateable, InterHitbox {
    
    private enemyShip: StateAnimations;
    private hitbox: Graphics;
    public static readonly MOVE_SPEED = 100;
    private health = 30;
    public mediumEnemyDead = false;
    public mediumShooting = false;
    private enemyType: number = 0;

    constructor(level: number) {

        super();
        this.enemyShip = new StateAnimations();
        this.enemyShip.addState("mediumIdleEnemy1", [Texture.from("Medium1.png")], 1);
        this.enemyShip.addState("mediumIdleEnemy2", [Texture.from("Medium2.png")], 1);
        this.enemyShip.addState("mediumIdleEnemy3", [Texture.from("Medium3.png")], 1);
        this.enemyShip.addState("mediumIdleEnemy4", [Texture.from("Medium4.png")], 1);
        this.enemyShip.addState("mediumIdleEnemy5", [Texture.from("Medium5.png")], 1);
        this.enemyShip.addState("mediumIdleEnemy6", [Texture.from("Medium6.png")], 1);
        this.enemyShip.addState("mediumEnemyExplode", [
           "MediumExplosion_1.png",
           "MediumExplosion_2.png",
           "MediumExplosion_3.png",
           "MediumExplosion_4.png",
           "MediumExplosion_5.png",
           "MediumExplosion_6.png",
           "MediumExplosion_7.png",
           "MediumExplosion_8.png",
           "MediumExplosion_9.png",
           "MediumExplosion_10.png",
        ], 0.25, false);
        if (level == 1) {
            this.enemyType = Math.floor((Math.random()*3)+1);
        } else if (level == 2) {
            this.enemyType = Math.floor((Math.random()*3)+4);
        }
        switch (this.enemyType) {
            case 1:
                this.enemyShip.playState("mediumIdleEnemy1");
                this.hitbox = new Graphics();
                this.hitbox.beginFill(0x0000FF, 0);
                this.hitbox.drawRect(-19,-15,38,30);
                this.hitbox.endFill();
                break;
        
            case 2:
                this.enemyShip.playState("mediumIdleEnemy2");
                this.hitbox = new Graphics();
                this.hitbox.beginFill(0x0000FF, 0);
                this.hitbox.drawRect(-12,-23,24,46);
                this.hitbox.endFill();
                break;
        
            case 3:
                this.enemyShip.playState("mediumIdleEnemy3");
                this.hitbox = new Graphics();
                this.hitbox.beginFill(0x0000FF, 0);
                this.hitbox.drawRect(-12,-23,24,46);
                this.hitbox.endFill();
                break;
        
            case 4:
                this.enemyShip.playState("mediumIdleEnemy4");
                this.hitbox = new Graphics();
                this.hitbox.beginFill(0x0000FF, 0);
                this.hitbox.drawRect(-16,-18,32,36);
                this.hitbox.endFill();
                break;
        
            case 5:
                this.enemyShip.playState("mediumIdleEnemy5");
                this.hitbox = new Graphics();
                this.hitbox.beginFill(0x0000FF, 0);
                this.hitbox.drawRect(-25,-7.5,50,15);
                this.hitbox.endFill();
                break;
        
            case 6:
                this.enemyShip.playState("mediumIdleEnemy6");
                this.hitbox = new Graphics();
                this.hitbox.beginFill(0x0000FF, 0);
                this.hitbox.drawRect(-7.5,-25,15,50);
                this.hitbox.endFill();
                break;
        
            default:
                this.enemyShip.playState("mediumIdleEnemy1");
                this.hitbox = new Graphics();
                this.hitbox.beginFill(0x0000FF, 0);
                this.hitbox.drawRect(-19,-15,38,30);
                this.hitbox.endFill();
                break;
        }
        this.enemyShip.rotation = Math.PI/2;

        this.addChild(this.enemyShip);

        this.speed.x = -MediumEnemy.MOVE_SPEED;
        this.speed.y = MediumEnemy.MOVE_SPEED * (Math.random() < 0.5 ? -1 : 1);

        this.enemyShip.addChild(this.hitbox);
        this.addChild(this.enemyShip);
        this.scale.set(2);

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
            this.scale.set(0.75);
            this.enemyShip.removeChild(this.hitbox);
            this.enemyShip.playState("mediumEnemyExplode");
            new Tween(this).
            to({scale: {x:0.05, y:0.05}}, 400).
            onComplete(()=>{this.mediumEnemyDead = true}).
            start();
        }
    }
    
    public respawn() {
        this.health = 30;
        if (this.enemyType < 4) {
            this.enemyType = Math.floor((Math.random()*3)+1);
        } else {
            this.enemyType = Math.floor((Math.random()*3)+4);
        }
        switch (this.enemyType) {
            case 1:
                this.enemyShip.playState("mediumIdleEnemy1");
                this.hitbox.clear();
                this.hitbox.beginFill(0x0000FF, 0);
                this.hitbox.drawRect(-19,-15,38,30);
                this.hitbox.endFill();
                break;
        
            case 2:
                this.enemyShip.playState("mediumIdleEnemy2");
                this.hitbox.clear();
                this.hitbox.beginFill(0x0000FF, 0);
                this.hitbox.drawRect(-12,-23,24,46);
                this.hitbox.endFill();
                break;
        
            case 3:
                this.enemyShip.playState("mediumIdleEnemy3");
                this.hitbox.clear();
                this.hitbox.beginFill(0x0000FF, 0);
                this.hitbox.drawRect(-12,-23,24,46);
                this.hitbox.endFill();
                break;
                case 4:
                this.enemyShip.playState("mediumIdleEnemy4");
                this.hitbox = new Graphics();
                this.hitbox.beginFill(0x0000FF, 0);
                this.hitbox.drawRect(-16,-18,32,36);
                this.hitbox.endFill();
                break;
        
            case 5:
                this.enemyShip.playState("mediumIdleEnemy5");
                this.hitbox = new Graphics();
                this.hitbox.beginFill(0x0000FF, 0);
                this.hitbox.drawRect(-25,-7.5,50,15);
                this.hitbox.endFill();
                break;
        
            case 6:
                this.enemyShip.playState("mediumIdleEnemy6");
                this.hitbox = new Graphics();
                this.hitbox.beginFill(0x0000FF, 0);
                this.hitbox.drawRect(-7.5,-25,15,50);
                this.hitbox.endFill();
                break;
        
            default:
                this.enemyShip.playState("mediumIdleEnemy1");
                this.hitbox.clear();
                this.hitbox.beginFill(0x0000FF, 0);
                this.hitbox.drawRect(-19,-15,38,30);
                this.hitbox.endFill();
                break;
        }
        this.speed.x = -MediumEnemy.MOVE_SPEED;
        this.scale.set(2);
        this.enemyShip.addChild(this.hitbox);
        this.mediumEnemyDead = false;
    }

}