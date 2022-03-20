import { AnimatedSprite, Container, Texture, Text, /*NineSlicePlane*/ } from "pixi.js";
import { MajoraHat } from "./MajoraHat";

export class Scene extends Container {

    constructor() {

        super();

        const majoraWithHat: MajoraHat = new MajoraHat();

	    majoraWithHat.scale.set(0.5);
	    majoraWithHat.position.set(640,360);

        this.addChild(majoraWithHat);  

        const animatedWolf: AnimatedSprite = new AnimatedSprite(
            [
                Texture.from("walkingWolf1"),
                Texture.from("walkingWolf2"),
                Texture.from("walkingWolf3"),
                Texture.from("walkingWolf4")
            ], true
        );
        animatedWolf.scale.set(2);
        animatedWolf.position.set(600,100);
        animatedWolf.play();
        animatedWolf.animationSpeed = 0.2;
        this.addChild(animatedWolf);

        const myText: Text = new Text("It's a me, Majora!", {fontSize: 42, fill: 0x3E642E});
        //myText.text = "jadlkhasldasl";
        myText.position.set(490,520)
        this.addChild(myText);

        /*Nine-Slice Plane
        const myPanel = new NineSlicePlane(
            Texture.from("Panel"),
            35, 35, 35, 35
        )
        myPanel.width = 500;
        myPanel.height = 300;
        myPanel.scale.set(2);
        this.addChild(myPanel);
        */

    }

}