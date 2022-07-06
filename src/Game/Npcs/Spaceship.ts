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
    private dead = false;
    private hitbox: Graphics;
    private shooting = false;
    private damage = 10;
    
    private static readonly SS_SPEED = 250;

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

        this.hitbox = new Graphics();
        this.hitbox.beginFill(0x268212, 0);
        this.hitbox.drawRect(-30,-12.5,60,25);
        this.hitbox.endFill();

        this.turboAnimations = new StateAnimations();
        this.turboAnimations.addState("normal", [
            "Ship3_normal_flight_01.png",
            "Ship3_normal_flight_02.png",
            "Ship3_normal_flight_03.png",
            "Ship3_normal_flight_04.png"
        ], 0.25);
        this.turboAnimations.playState("normal");

        this.turboAnimations.position.set(this.SsAnimations.x-50,this.SsAnimations.y);
        this.cannonAnimations.position.set(this.SsAnimations.x+75, this.SsAnimations.y+5);

        this.wholeShip.addChild(this.SsAnimations,this.turboAnimations);
        this.addChild(this.wholeShip, this.hitbox);

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
        if (!this.dead) {
            if (Keyboard.state.get("ArrowRight")) {
                this.speed.x = Spaceship.SS_SPEED;
            } else {
                this.speed.x = 0;
            }
            if (Keyboard.state.get("ArrowLeft")) {
                this.speed.x = -Spaceship.SS_SPEED;
            }
            if (Keyboard.state.get("ArrowUp")) {
                this.speed.y = -Spaceship.SS_SPEED;
            } else {
                this.speed.y = 0;
            }
            if (Keyboard.state.get("ArrowDown")) {
                this.speed.y = Spaceship.SS_SPEED;
            }

        }

    }

    private explode() {
        this.wholeShip.removeChild(this.cannonAnimations);
        this.SsAnimations.playState("explode");
        this.dead = true;
        new Tween({dc:0}).to({dc:1},400).onComplete(()=>{
            this.removeChild(this.wholeShip);
        }).start();
    }

    public shoot() {
        if (!this.shooting) {
            this.shooting = true;
            this.wholeShip.addChild(this.cannonAnimations);
            this.cannonAnimations.playState("shooting");
            new Tween({dc:0})
            .to({dc:1},100)
            .onComplete(()=>{
                this.shooting = false;
                this.wholeShip.removeChild(this.cannonAnimations);
            }).start();
        }
    }

    public getHitbox():Rectangle {
        return this.hitbox.getBounds();
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

    public dealDamage():number {
        return this.damage;
    }

    public isShooting() {
        return this.shooting;
    }

    public isDead() {
        return this.dead;
    }

}