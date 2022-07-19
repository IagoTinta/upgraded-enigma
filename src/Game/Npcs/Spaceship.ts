import { GlowFilter } from "@pixi/filter-glow";
import { Container, Graphics, ObservablePoint, Rectangle, Texture } from "pixi.js";
import { Tween } from "tweedle.js";
import { PhysicsContainer } from "../PhysicsContainer";
import { InterHitbox } from "../Utils/InterHitbox";
import { InterUpdateable } from "../Utils/InterUpdateable";
import { Keyboard } from "../Utils/Keyboard";
import { StateAnimations } from "../Utils/StateAnimations";


export class Spaceship extends PhysicsContainer implements InterUpdateable, InterHitbox {

    private SsAnimations: StateAnimations;
    private turboAnimations: StateAnimations;
    private cannonAnimations: StateAnimations;
    private wholeShip: Container;
    private Sshitbox: Graphics;
    private shootingSs = false;
    private damageSs = 10;
    private turboSs = false;
    private damageUpSs = false;
    private shieldSs = true;
    private lifes = 0;
    
    private static readonly SS_SPEED = 200;

    constructor() {

        super();
        this.wholeShip = new Container;
        this.SsAnimations = new StateAnimations();
        this.SsAnimations.addState("idle", [
            Texture.from("Spaceship3.png")
        ],0.5);
        this.SsAnimations.addState("explode", [
            "Ship3_Explosion_01.png",
            "Ship3_Explosion_02.png",
            "Ship3_Explosion_03.png",
            "Ship3_Explosion_04.png",
            "Ship3_Explosion_05.png",
            "Ship3_Explosion_06.png",
            "Ship3_Explosion_07.png",
            "Ship3_Explosion_08.png",
            "Ship3_Explosion_09.png",
            "Ship3_Explosion_010.png",
            "Ship3_Explosion_011.png",
        ], 0.5, false);
        this.cannonAnimations = new StateAnimations();
        this.cannonAnimations.addState("shooting", [
            "shot3_1.png",
            "shot3_2.png",
            "shot3_3.png"
        ], 0.25, false);
        this.SsAnimations.playState("idle");

        this.Sshitbox = new Graphics();
        this.Sshitbox.beginFill(0x268212, 0);
        this.Sshitbox.drawRect(-15,-7.5,30,15);
        this.Sshitbox.endFill();

        this.turboAnimations = new StateAnimations();
        this.turboAnimations.addState("normal", [
            "Ship3_normal_flight_01.png",
            "Ship3_normal_flight_02.png",
            "Ship3_normal_flight_03.png",
            "Ship3_normal_flight_04.png"
        ], 0.25);
        this.turboAnimations.addState("turbo", [
            "Ship3_turbo_flight_1.png",
            "Ship3_turbo_flight_2.png",
            "Ship3_turbo_flight_3.png",
            "Ship3_turbo_flight_4.png",
        ], 0.25, true);
        this.turboAnimations.playState("normal");

        this.turboAnimations.position.set(this.SsAnimations.x-50,this.SsAnimations.y);
        this.cannonAnimations.position.set(this.SsAnimations.x+75, this.SsAnimations.y+5);

        this.cannonAnimations.filters = [new GlowFilter({color: 0xFF0000})];

        this.wholeShip.addChild(this.SsAnimations,this.turboAnimations);
        this.addChild(this.wholeShip, this.Sshitbox);

        Keyboard.down.on("Enter", this.explode, this);

    }

    public override destroy(options:any) {
        super.destroy(options);
        Keyboard.down.off("Enter", this.explode);
    }

    public override update(deltaMS: number): void {

        const dt = deltaMS / 60;
        super.update(dt);
        this.SsAnimations.updateAnim(dt);
        this.turboAnimations.updateAnim(dt);
        if (this.lifes>-1) {
            if (Keyboard.state.get("ArrowRight")) {
                if (this.turboSs) {
                    this.speed.x = Spaceship.SS_SPEED+125;
                } else {
                    this.speed.x = Spaceship.SS_SPEED;
                }
            } else {
                this.speed.x = 0;
            }
            if (Keyboard.state.get("ArrowLeft")) {
                if (this.turboSs) {
                    this.speed.x = -Spaceship.SS_SPEED-125;
                } else {
                    this.speed.x = -Spaceship.SS_SPEED;
                }
            }
            if (Keyboard.state.get("ArrowUp")) {
                if (this.turboSs) {
                    this.speed.y = -Spaceship.SS_SPEED-125;
                } else {
                    this.speed.y = -Spaceship.SS_SPEED;
                }
            } else {
                this.speed.y = 0;
            }
            if (Keyboard.state.get("ArrowDown")) {
                if (this.turboSs) {
                    this.speed.y = Spaceship.SS_SPEED+125;
                } else {
                    this.speed.y = Spaceship.SS_SPEED;
                }
            }

        }

    }

    public explode() {
        if (this.shieldSs) {
            this.shieldSs = false;
        } else {
            this.lifes--;
            this.damageUpSs = false;
            this.turboSs = false;
            this.shieldSs = true;
            this.wholeShip.removeChild(this.cannonAnimations, this.turboAnimations);
            this.SsAnimations.playState("explode");
            this.removeChild(this.Sshitbox);
            new Tween({dc:0}).to({dc:1},400).onComplete(()=>{
                this.removeChild(this.wholeShip);
            }).start();
        }
    }

    public shoot() {
        if (!this.shootingSs) {
            this.shootingSs = true;
            this.wholeShip.addChild(this.cannonAnimations);
            this.cannonAnimations.playState("shooting");
            new Tween({dc:0})
            .to({dc:1},100)
            .onComplete(()=>{
                this.shootingSs = false;
                this.wholeShip.removeChild(this.cannonAnimations);
            }).start();
        }
    }

    // public respawn() {
    //     this.wholeShip.addChild(this.cannonAnimations, this.turboAnimations);
    //     this.SsAnimations.playState("idle");
    //     new Tween({dc:0}).
    //     to({dc:1}, 2000).
    //     onComplete(()=>{this.addChild(this.Sshitbox)}).
    //     start();
    // }

    public getHitbox():Rectangle {
        return this.Sshitbox.getBounds();
    }

    public separate(overlap: Rectangle, solid: ObservablePoint<any>) {
        if (overlap.width < overlap.height){
            if (this.x > solid.x) {
                this.x += overlap.width+1;
            } else if (this.x < solid.x){
                this.x -= overlap.width;
            }
        } else {
            if (this.y < solid.y) {
                this.y -= overlap.height;
            } else if (this.x > solid.y){
                this.y += overlap.height;
            }
        }

    }

    public getBonus(bonus: string) {
        switch (bonus) {
            case "turbo":
                this.turboSs = true;
                this.turboAnimations.playState("turbo");
                break;
        
            case "shield":
                this.shieldSs = true;
                break;
        
            case "damage":
                this.damageUpSs = true;
                break;
        
            default:
                break;
        }
    }

    public dealDamage():number {
        if (this.damageUpSs){
            return this.damageSs*2;
        } else {
            return this.damageSs;
        }
    }

    public isShooting() {
        return this.shootingSs;
    }

    public isDead() {
        if (this.lifes<=-1) {
            return true;
        } else {
            return false;
        }
    }
}