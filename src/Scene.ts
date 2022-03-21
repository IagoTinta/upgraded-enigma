import { Container} from "pixi.js";
import { Board } from "./Board";
import { ScoreAndRating } from "./ScoreAndRating";
import { WalkingWolf } from "./WalkingWolf";

export class Scene extends Container {

    constructor() {

        super();

        const completeBoard: Board = new Board();

        const GameScoreBoard: ScoreAndRating = new ScoreAndRating();
        this.addChild(completeBoard,GameScoreBoard);

        const walkingWolfLeft: WalkingWolf = new WalkingWolf();
        const walkingWolfRight: WalkingWolf = new WalkingWolf();
        walkingWolfLeft.position.set(780,590);
        walkingWolfRight.position.set(500,590);
        walkingWolfRight.scale.set(-1,1);
        this.addChild(walkingWolfLeft,walkingWolfRight);

    }

}