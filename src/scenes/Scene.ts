import { Container, Ticker} from "pixi.js";
import { Board } from "../Game/Board";
import { ScoreAndRating } from "../Game/ScoreAndRating";
import { WalkingWolf } from "../Game/Npcs/WalkingWolf";
import { Larry } from "../Game/Npcs/Larry";

export class Scene extends Container {

    constructor() {

        super();
        const modelLarry: Larry = new Larry();
        modelLarry.position.set(1000,625);
        this.addChild(modelLarry);

        const completeBoard: Board = new Board();

        const GameScoreBoard: ScoreAndRating = new ScoreAndRating();
        this.addChild(completeBoard,GameScoreBoard);

        const walkingWolfLeft: WalkingWolf = new WalkingWolf();
        const walkingWolfRight: WalkingWolf = new WalkingWolf();
        walkingWolfLeft.position.set(780,590);
        walkingWolfRight.position.set(500,590);
        walkingWolfRight.scale.set(-1,1);


        this.addChild(walkingWolfLeft,walkingWolfRight);
        Ticker.shared.add(function(deltaFrame){
            modelLarry.update(deltaFrame,Ticker.shared.deltaMS);
        })

    }

}