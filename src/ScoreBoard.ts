import { Container, NineSlicePlane, Texture } from "pixi.js";

export class ScoreBoard extends Container {

    constructor() {

        super();

        const Board = new NineSlicePlane(Texture.from("Board"),35,35,35,35);
        Board.position.set(1280/2,720/2);
        Board.pivot.set(150,150);
        Board.width = 300;
        Board.height = 300;
        Board.scale.set(2);

        const insideBoard = new NineSlicePlane(Texture.from("scoresPanel"),35,35,35,35);
        insideBoard.position.set(640,340);
        insideBoard.pivot.set(139,100);
        insideBoard.width = 278;
        insideBoard.height = 200;
        insideBoard.scale.set(2);

        this.addChild(Board,insideBoard);

    }

}
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