import { AnimatedSprite, Graphics, ObservablePoint, Rectangle, Sprite, Texture} from "pixi.js";
import { PhysicsContainer } from "../PhysicsContainer";
import { InterHitbox } from "../Utils/InterHitbox";
import { InterUpdateable } from "../Utils/InterUpdateable";
import { Keyboard } from "../Utils/Keyboard";


export class Larry extends PhysicsContainer implements InterUpdateable,InterHitbox {

    //Animaciones
    private walkingLarry: AnimatedSprite;
    private idleLarry:Sprite;
    private crouchingLarry:AnimatedSprite;
    private jumpingLarry:Sprite;

    //hitboxes
    private hitbox:Graphics;

    //stats
    private health = 100;

    //constantes y condiciones
    private static readonly GRAVITY = 200;
    private static readonly MOVE_SPEED = 300;
    public canJump = true;
    private facingRight = true;
    public damageCheck = true;

    constructor(){

        super();
        this.walkingLarry = new AnimatedSprite (
            [
                Texture.from("walkLarry1"),
                Texture.from("walkLarry2"),
                Texture.from("walkLarry3"),
                Texture.from("walkLarry4"),
                Texture.from("walkLarry5"),
                Texture.from("walkLarry6"),
            ], false
        );
        this.idleLarry = Sprite.from("idleLarry");
        this.crouchingLarry = new AnimatedSprite (
            [
                Texture.from("crouchLarry3")
            ], false
        )
        this.jumpingLarry = Sprite.from("jumpLarry1");
        this.idleLarry.anchor.set(0.5);
        this.walkingLarry.anchor.set(0.5);
        this.walkingLarry.play();
        this.walkingLarry.animationSpeed = 0.175;
        this.walkingLarry.visible = false;
        this.crouchingLarry.anchor.set(0.5);
        this.crouchingLarry.position.y = 7;
        this.crouchingLarry.play();
        this.crouchingLarry.visible = false;
        this.jumpingLarry.anchor.set(0.5);
        this.jumpingLarry.visible = false;

        this.hitbox = new Graphics();
        this.hitbox.beginFill(0x268212, 0.5);
        this.hitbox.drawRect(0,0,18,46);
        this.hitbox.endFill();
        this.hitbox.position.set(-9,-23);

        this.acceleration.y = Larry.GRAVITY;
        this.addChild(
            this.walkingLarry,
            this.idleLarry,
            this.crouchingLarry,
            this.jumpingLarry
        );
        this.addChild(this.hitbox);

    }
    public override update(deltaMS: number): void {
        const dt = deltaMS / (60);
        super.update(dt);
        this.walkingLarry.update(dt / (1/60));
        //console.log(this.health);
        if (Keyboard.state.get("KeyS") && this.canJump) {
            this.idleLarry.visible = false;
            this.walkingLarry.visible = false;
            this.crouchingLarry.visible = true;
            this.speed.x = 0;
            if (!this.facingRight) {
                this.scale.set(-4,4);
            } else {
                this.scale.set(4);
            }
        } else {
            this.crouchingLarry.visible = false;
            if (Keyboard.state.get("KeyD") && this.canJump) {
                this.walkingLarry.visible = true;
                this.idleLarry.visible = false;
                this.speed.x = Larry.MOVE_SPEED;
                this.facingRight = true;
                if (this.facingRight) {
                    this.scale.set(4);
                }
            } else {
                this.walkingLarry.visible = false;
                if (this.canJump) {
                    this.idleLarry.visible = true;
                    this.jumpingLarry.visible = false;
                }
                this.speed.x = 0;
                if(this.facingRight) {
                    this.scale.set(4);
                } else {
                    this.scale.set(-4,4);
                }
            }
            if (Keyboard.state.get("KeyA") && this.canJump) {
                this.walkingLarry.visible = true;
                this.idleLarry.visible = false;
                this.speed.x = -Larry.MOVE_SPEED;
                this.facingRight = false;
                if (!this.facingRight){
                    this.scale.set(-4,4);
                }
            }
        }
        if (Keyboard.state.get("KeyW") && this.canJump) {
            this.idleLarry.visible = false;
            this.jumpingLarry.visible = true;
            this.speed.y = -Larry.MOVE_SPEED-100;
            this.canJump = false;
        } else if (Keyboard.state.get("KeyD") && !this.canJump && this.y < 900) {
            this.speed.x = Larry.MOVE_SPEED;
            this.scale.set(4);
        } else if (Keyboard.state.get("KeyA") && !this.canJump && this.y < 900) {
            this.speed.x = -Larry.MOVE_SPEED;
            this.scale.set(-4,4);
        } else  if (this.y > 900 || this.speed.y == 0) {
            this.jumpingLarry.visible = false;
            this.canJump = true;
        }
        
    }

    public getHitbox():Rectangle {
        return this.hitbox.getBounds();
    }

    public separate(overlap: Rectangle, objeto: ObservablePoint<any>) {
        if (overlap.width < overlap.height){
            if (this.x > objeto.x) {
                this.x += overlap.width;
            } else if (this.x < objeto.x){
                this.x -= overlap.width;
            }
        } else {
            if (this.y < objeto.y) {
                this.y -= overlap.height;
                this.canJump = true;
            } else if (this.x > objeto.y){
                this.y += overlap.height;
            }
        }

    }

    public receiveDamage(damage: number) {
        this.health -= damage;
    }

    public isDead():boolean {
       if(this.health <= 0) {
           return true;
       } else {
           return false;
       }
    }

}