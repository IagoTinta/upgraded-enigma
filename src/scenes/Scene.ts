import { Container, Sprite, Ticker, Text} from "pixi.js";
import { WIDTH } from "..";
//import { Board } from "../Game/Board";
//import { ScoreAndRating } from "../Game/ScoreAndRating";
//import { WalkingWolf } from "../Game/Npcs/WalkingWolf";
import { Larry } from "../Game/Npcs/Larry";
import { Majora } from "../Game/Npcs/Majora";

export class Scene extends Container {

    private modelLarry: Larry;
    private myMajora: Majora;

    constructor() {

        super();
        
        /*const completeBoard: Board = new Board();
        
        const GameScoreBoard: ScoreAndRating = new ScoreAndRating();
        this.addChild(completeBoard,GameScoreBoard);
        
        const walkingWolfLeft: WalkingWolf = new WalkingWolf();
        const walkingWolfRight: WalkingWolf = new WalkingWolf();
        walkingWolfLeft.position.set(780,590);
        walkingWolfRight.position.set(500,590);
        walkingWolfRight.scale.set(-1,1);
        
        this.addChild(walkingWolfLeft,walkingWolfRight);*/
        
        const FrostwoodsLevel: Container = new Container();
        const Background: Sprite = Sprite.from("Background");
        const Floor:Sprite = Sprite.from("Floor");
        FrostwoodsLevel.addChild(Floor, Background);
        FrostwoodsLevel.scale.x = 0.70;
        FrostwoodsLevel.scale.y = 0.68;
        this.addChild(FrostwoodsLevel);

        this.modelLarry = new Larry();
        this.modelLarry.position.set(WIDTH/2,617);
        this.addChild(this.modelLarry);
        
        this.myMajora = new Majora();
        this.myMajora.position.set(900,617);
        this.addChild(this.myMajora);

        Ticker.shared.add(function(){
            this.modelLarry.update(Ticker.shared.deltaMS);
        });

        const Titulo: Text = new Text("Larry's Adventure Day", {fontSize: 40, fill:0xFFFFFF, fontFamily: "Cambria"});
        const Descripcion: Text = new Text("Plataform Autoscroller With Combat", {fontSize: 40, fill:0xFFFFFF, fontFamily: "Cambria"});
        Titulo.anchor.set(0.5);
        Descripcion.anchor.set(0.5);
        Titulo.position.set(640,15);
        Descripcion.position.set(640,50);
        this.addChild(Titulo,Descripcion);
      

    }

    
}