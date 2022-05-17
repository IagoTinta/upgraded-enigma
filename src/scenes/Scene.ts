import { Container, Sprite, Text} from "pixi.js";
import { WIDTH } from "..";
import { Enemy } from "../Game/Npcs/Enemy";
//import { Board } from "../Game/Board";
//import { ScoreAndRating } from "../Game/ScoreAndRating";
//import { WalkingWolf } from "../Game/Npcs/WalkingWolf";
import { Larry } from "../Game/Npcs/Larry";
import { checkCollision } from "../Game/Utils/InterHitbox";
import { InterUpdateable } from "../Game/Utils/InterUpdateable";

export class Scene extends Container implements InterUpdateable{

    private modelLarry: Larry;
    private enemy: Enemy;
    private gameOver = false;

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
        const background1:Sprite = Sprite.from("Background1");
        const background2:Sprite = Sprite.from("Background2");
        const background3:Sprite = Sprite.from("Background3");
        const background4:Sprite = Sprite.from("Background4");
        const background5:Sprite = Sprite.from("Background5");
        const background6:Sprite = Sprite.from("Background6");
        const background7:Sprite = Sprite.from("Background7");
        FrostwoodsLevel.addChild(background7,
            background6,
            background5,
            background4,
            background3,
            background2,
            background1
        );
        FrostwoodsLevel.scale.x = 0.70;
        FrostwoodsLevel.scale.y = 0.68;
        this.addChild(FrostwoodsLevel);

        this.modelLarry = new Larry();
        this.modelLarry.position.set(WIDTH/2,617);
        this.addChild(this.modelLarry);
        
        this.enemy = new Enemy(1);
        this.enemy.position.set(900,630 );
        this.addChild(this.enemy);

        const Titulo: Text = new Text("Larry's Adventure Day", {fontSize: 40, fill:0xFFFFFF, fontFamily: "Cambria"});
        const Descripcion: Text = new Text("Plataform Autoscroller With Combat", {fontSize: 40, fill:0xFFFFFF, fontFamily: "Cambria"});
        Titulo.anchor.set(0.5);
        Descripcion.anchor.set(0.5);
        Titulo.position.set(640,15);
        Descripcion.position.set(640,50);
        this.addChild(Titulo,Descripcion);
      

    }

    public update (deltaTime: number, _deltaFrame: number):void {

        if (this.gameOver) {
            return;
        }
        this.modelLarry.update(deltaTime);
        this.enemy.update(deltaTime);
        //console.log(checkCollision(this.modelLarry, this.enemy));
        const overlap = checkCollision(this.modelLarry, this.enemy);
        if (overlap != null && this.modelLarry.damageCheck) {

            //this.modelLarry.separate(overlap, this.enemy.position);
            this.modelLarry.receiveDamage(this.enemy.dealDamage());
            this.modelLarry.damageCheck = false;

        } else if (overlap != null) {
            this.modelLarry.damageCheck = false;
        } else {
            this.modelLarry.damageCheck = true;
        }

        if (this.modelLarry.y > 617 && this.modelLarry.canJump) {
            this.modelLarry.canJump = true;
            this.modelLarry.y = 617;
            this.modelLarry.speed.y = 0;
        }

        if (this.modelLarry.x > WIDTH-25) {
            this.modelLarry.x = WIDTH-25;
            this.modelLarry.speed.x = 0;
        }
        if (this.modelLarry.x < 25) {
            this.modelLarry.x = 25;
            this.modelLarry.speed.x = 0;
        }

        if (this.modelLarry.isDead()) {
            this.gameOver = true;
        }

    }
    
}