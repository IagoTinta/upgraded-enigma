import { Container} from "pixi.js";
import { ScoreBoard } from "./ScoreBoard";
import { WalkingWolf } from "./WalkingWolf";

export class Scene extends Container {

    constructor() {

        super();
        const GameScoreBoard: ScoreBoard = new ScoreBoard();
        this.addChild(GameScoreBoard);

        /* const myText: Text = new Text("It's a me, Majora!", {fontSize: 42, fill: 0x3E642E});
        myText.position.set(490,520)
        this.addChild(myText); */

        const walkingWolf: WalkingWolf = new WalkingWolf();
        this.addChild(walkingWolf);

    }

}