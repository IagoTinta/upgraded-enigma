import { AnimatedSprite, Container, Texture } from "pixi.js";

export class WalkingWolf extends Container {

    constructor() {

        super();
        const animatedWolf: AnimatedSprite = new AnimatedSprite(
            [
                Texture.from("walkingWolf1"),
                Texture.from("walkingWolf2"),
                Texture.from("walkingWolf3"),
                Texture.from("walkingWolf4")
            ], true
        );
        animatedWolf.anchor.set(0.5);
        animatedWolf.scale.set(2);
        animatedWolf.play();
        animatedWolf.animationSpeed = 0.2;
        this.addChild(animatedWolf);

    }

}