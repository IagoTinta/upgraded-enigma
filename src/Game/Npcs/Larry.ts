import { AnimatedSprite, Container, Sprite, Texture} from "pixi.js";
//import { WIDTH } from "../..";
import { PhysicsContainer } from "../PhysicsContainer";
import { InterUpdateable } from "../Utils/InterUpdateable";
import { Keyboard } from "../Utils/Keyboard";


export class Larry extends Container implements InterUpdateable{

    private walkingLarry: AnimatedSprite;
    private idleLarry:Sprite;
    private crouchingLarry:AnimatedSprite;
    private physicsLarry: PhysicsContainer;

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
        this.idleLarry.anchor.set(0.5);
        this.idleLarry.scale.set(2.5);
        this.walkingLarry.anchor.set(0.5);
        this.walkingLarry.scale.set(2.5);
        this.walkingLarry.play();
        this.walkingLarry.animationSpeed = 0.175;
        this.walkingLarry.visible = false;
        this.crouchingLarry.anchor.set(0.5);
        this.crouchingLarry.scale.set(2.5);
        this.crouchingLarry.position.y = 18;
        this.crouchingLarry.play();
        this.crouchingLarry.visible = false;

        this.physicsLarry = new PhysicsContainer();
        this.physicsLarry.addChild(this.walkingLarry,this.idleLarry,this.crouchingLarry);
        
        this.addChild(this.physicsLarry);

    }
    public update(deltaFrame: number, deltaTime: number): void {
        this.walkingLarry.update(deltaFrame);
        const dt = deltaTime / 1000;
        if (Keyboard.state.get("KeyD")) {
            this.walkingLarry.visible = true;
            this.idleLarry.visible = false;
            this.physicsLarry.speed.x = 300;
            this.physicsLarry.update(Math.abs(dt));
            if (this.physicsLarry.speed.x > 0) {
                this.walkingLarry.scale.set(2.5);
            }
        } else {
            if(this.physicsLarry.speed.x >= 0) {
                this.walkingLarry.visible = false;
                this.idleLarry.visible = true;
                this.idleLarry.scale.set(2.5);
                this.idleLarry.position = this.walkingLarry.position;
            } else {
                this.walkingLarry.visible = false;
                this.idleLarry.visible = true;
                this.idleLarry.scale.set(-2.5,2.5);
                this.idleLarry.position = this.walkingLarry.position;
            }
        }
        if (Keyboard.state.get("KeyA")) {
            this.walkingLarry.visible = true;
            this.idleLarry.visible = false;
            this.physicsLarry.speed.x = -300;
            this.physicsLarry.update(Math.abs(dt));
            if (this.physicsLarry.speed.x < 0){
                this.walkingLarry.scale.set(-2.5,2.5);
            }
        }
        if (Keyboard.state.get("KeyS")) {
            this.idleLarry.visible = false;
            this.crouchingLarry.visible = true;
            if (this.physicsLarry.speed.x < 0) {
                this.crouchingLarry.scale.set(-2.5,2.5);
            } else {
                this.crouchingLarry.scale.set(2.5);
            }
        } else if (!Keyboard.state.get("KeyS")) {
            this.crouchingLarry.visible = false;
        }
    }

}