import { AnimatedSprite, Container, NineSlicePlane, Texture } from "pixi.js";


export class Board extends Container {

    constructor() {

        super();

        const completeBoard: Container = new Container();
        const outsideBoard = new NineSlicePlane(Texture.from("Board"),35,35,35,35);
        const crouchLarryBoard: AnimatedSprite = new AnimatedSprite(
            [
            Texture.from("crouchLarry3"),
            Texture.from("crouchLarryReversed")
            ], true
        );
        outsideBoard.position.set(1280/2,720/2);
        outsideBoard.pivot.set(150,150);
        outsideBoard.width = 300;
        outsideBoard.height = 300;
        outsideBoard.scale.set(2);
        crouchLarryBoard.anchor.set(0.5);
        crouchLarryBoard.position.set(640,590);
        crouchLarryBoard.scale.set(2.5);
        crouchLarryBoard.play();
        crouchLarryBoard.animationSpeed = 0.025;
        completeBoard.addChild(outsideBoard,crouchLarryBoard);

        const insideBoard = new NineSlicePlane(Texture.from("scoresPanel"),35,35,35,35);
        insideBoard.position.set(640,340);
        insideBoard.pivot.set(139,100);
        insideBoard.width = 278;
        insideBoard.height = 200;
        insideBoard.scale.set(2);

        this.addChild(completeBoard,insideBoard);

    }

}