import { Container, Sprite, Ticker, Text} from "pixi.js";
//import { Board } from "../Game/Board";
//import { ScoreAndRating } from "../Game/ScoreAndRating";
//import { WalkingWolf } from "../Game/Npcs/WalkingWolf";
import { Larry } from "../Game/Npcs/Larry";
import { Keyboard } from "../Game/Utils/Keyboard";

export class Scene extends Container {

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
        
        const modelLarry: Larry = new Larry();
        modelLarry.position.set(1000,617);
        this.addChild(modelLarry);

        Ticker.shared.add(function(deltaFrame){
            modelLarry.update(deltaFrame,Ticker.shared.deltaMS);
        });

        const Titulo: Text = new Text("Larry's Adventure Day", {fontSize: 40, fill:0xFFFFFF, fontFamily: "Cambria"});
        const Descripcion: Text = new Text("Plataform Autosidescroller With Combat", {fontSize: 40, fill:0xFFFFFF, fontFamily: "Cambria"});
        Titulo.anchor.set(0.5);
        Descripcion.anchor.set(0.5);
        Titulo.position.set(640,15);
        Descripcion.position.set(640,50);
        this.addChild(Titulo,Descripcion);

        Keyboard.down.on("KeyW", this.onKeyWdown, this)
        Keyboard.up.on("KeyW", this.onKeyWup, this)
        Keyboard.down.on("KeyA", this.onKeyAdown, this)
        Keyboard.up.on("KeyA", this.onKeyAup, this)
        Keyboard.down.on("KeyS", this.onKeySdown, this)
        Keyboard.up.on("KeyS", this.onKeySup, this)
        Keyboard.down.on("KeyD", this.onKeyDdown, this)
        Keyboard.up.on("KeyD", this.onKeyDup, this)
        Keyboard.down.on("Space", this.onKeySpacedown, this)
        Keyboard.up.on("Space", this.onKeySpaceup, this)        

    }

    private onKeyWdown():void{
        console.log("jump");
    }
    private onKeyWup():void{
        console.log("stop jumping");
    }
    private onKeyAdown():void{
        console.log("move left");
    }
    private onKeyAup():void{
        console.log("stop left");
    }
    private onKeySdown():void{
        console.log("crouch");
    }
    private onKeySup():void{
        console.log("stop crouching");
    }
    private onKeyDdown():void{
        console.log("move right");
    }
    private onKeyDup():void{
        console.log("stop right");
    }
    private onKeySpacedown():void{
        console.log("jump");
    }
    private onKeySpaceup():void{
        console.log("stop jumping");
    }

}