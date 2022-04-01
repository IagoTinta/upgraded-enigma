import { AnimatedSprite, Container, Texture } from "pixi.js";


export class Larry extends Container{

    constructor(){

        super();
        const walkingLarry: AnimatedSprite = new AnimatedSprite (
            [
                Texture.from("walkLarry1"),
                Texture.from("walkLarry2"),
                Texture.from("walkLarry3"),
                Texture.from("walkLarry4"),
                Texture.from("walkLarry5"),
                Texture.from("walkLarry6"),
            ], true
        );
        walkingLarry.anchor.set(0.5);
        walkingLarry.scale.set(2);
        walkingLarry.play();
        walkingLarry.animationSpeed = 0.4;
        this.addChild(walkingLarry);

    }

}