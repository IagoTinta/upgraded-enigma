import { Container, Text, Texture, TilingSprite} from "pixi.js";
import { HEIGHT, WIDTH } from "..";
import { Enemy } from "../Game/Npcs/Enemy";
//import { Board } from "../Game/Board";
//import { ScoreAndRating } from "../Game/ScoreAndRating";
//import { WalkingWolf } from "../Game/Npcs/WalkingWolf";
import { Larry } from "../Game/Npcs/Larry";
import { checkCollision} from "../Game/Utils/InterHitbox";
import { InterUpdateable } from "../Game/Utils/InterUpdateable";
import { Wall } from "../Game/WorldObjects/Wall";

export class Scene extends Container implements InterUpdateable{

    private myLevel: Container;
    private myLarry: Larry;
    private enemies: Enemy[];
    private rightWall: Wall;
    private leftWall: Wall;
    private gameOver = false;
    private background4: TilingSprite;

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
        
        this.myLevel = new Container();
        const background1 = new TilingSprite(Texture.from("Background1"),WIDTH*2,HEIGHT*2);
        const background2 = new TilingSprite(Texture.from("Background2"),WIDTH*2,HEIGHT*2);
        const background3 = new TilingSprite(Texture.from("Background3"),WIDTH*2,HEIGHT*2);
        this.background4 = new TilingSprite(Texture.from("Background4"),WIDTH*2,HEIGHT*2);
        const background5 = new TilingSprite(Texture.from("Background5"),WIDTH*2,HEIGHT*2);
        const background6 = new TilingSprite(Texture.from("Background6"),WIDTH*2,HEIGHT*2);
        const background7 = new TilingSprite(Texture.from("Background7"),WIDTH*2,HEIGHT*2);
        this.myLevel.addChild(background7,
            background6,
            background5,
            this.background4,
            background3,
            background2,
            background1
        );

        this.rightWall = new Wall();
        this.leftWall = new Wall();
        this.rightWall.position.x = 1830;
        this.leftWall.position.x = -100;
        this.myLevel.addChild(this.rightWall, this.leftWall);

        this.myLarry = new Larry();
        this.myLarry.position.set(960,900);
        this.myLevel.addChild(this.myLarry);
        
        this.enemies = [];
        const anotherEnemy1 = new Enemy(Math.floor((Math.random()*3)+1));
        anotherEnemy1.position.set(900,925);
        this.enemies.push(anotherEnemy1);
        this.myLevel.addChild(anotherEnemy1);
        const anotherEnemy2 = new Enemy(Math.floor((Math.random()*3)+1));
        anotherEnemy2.position.set(900,925);
        this.enemies.push(anotherEnemy2);
        this.myLevel.addChild(anotherEnemy2);
        const anotherEnemy3 = new Enemy(Math.floor((Math.random()*3)+1));
        anotherEnemy3.position.set(900,925);
        this.enemies.push(anotherEnemy3);
        this.myLevel.addChild(anotherEnemy3);

        const Titulo: Text = new Text("Larry's Adventure Day", {fontSize: 40, fill:0xFFFFFF, fontFamily: "Cambria"});
        const Descripcion: Text = new Text("Plataform Autoscroller With Combat", {fontSize: 40, fill:0xFFFFFF, fontFamily: "Cambria"});
        Titulo.anchor.set(0.5);
        Descripcion.anchor.set(0.5);
        Titulo.position.set(960,22.5);
        Descripcion.position.set(960,60);
        this.myLevel.addChild(Titulo,Descripcion);

        this.myLevel.scale.x = 0.70;
        this.myLevel.scale.y = 0.68;
        this.addChild(this.myLevel);
      
    }

    public update (deltaTime: number, _deltaFrame: number):void {

        if (this.gameOver) {
            return;
        }
        //console.log(this.myLarry.speed.x);
        //console.log(this.myLarry.toGlobal(this.myLevel).x);
        this.myLarry.update(deltaTime);

        for (let enemy of this.enemies) {

            enemy.update(deltaTime);
            const overlap = checkCollision(this.myLarry, enemy);
            const rEnemyWall = checkCollision(enemy,this.rightWall);
            const lEnemyWall = checkCollision(enemy,this.leftWall);
            if (overlap != null && this.myLarry.damageCheck) {

                //this.modelLarry.separate(overlap, this.enemy.position);
                //this.modelLarry.receiveDamage(enemy.dealDamage());
                this.myLarry.damageCheck = false;
                enemy.speed.x = 0;

            } else if (overlap != null) {
                this.myLarry.damageCheck = false;
            } else  if (enemy.speed.x == 0) {
                enemy.resumeSpeed();
            } else {
                this.myLarry.damageCheck = true;
            }

            if (rEnemyWall != null) {
                enemy.speed.x = -enemy.speed.x;
            }
            if (lEnemyWall != null) {
                enemy.speed.x = -enemy.speed.x;
            }

        }

        const rLarryWall = checkCollision(this.myLarry, this.rightWall);
        const lLarryWall = checkCollision(this.myLarry, this.leftWall);

        if (rLarryWall != null) {
            this.myLarry.separate(rLarryWall, this.rightWall.position);
        }
        if (lLarryWall != null) {
            this.myLarry.separate(lLarryWall, this.leftWall.position);
        }

        if (this.myLarry.y > 900 && this.myLarry.canJump) {
            this.myLarry.canJump = true;
            this.myLarry.y = 900;
            this.myLarry.speed.y = 0;
        }

        if (this.myLarry.isDead()) {
            this.gameOver = true;
        }

        this.myLevel.x -= 0.1 * this.worldTransform.a;
        this.background4.tilePosition.x = this.myLevel.x;
        this.rightWall.position.x += 0.1422725 * this.worldTransform.a;

        /*if (this.enemies.length < 3) {
            //wait
            const anotherEnemy = new Enemy((Math.random()*3)+1);
            anotherEnemy.update(deltaTime);
            anotherEnemy.position.set(900,632);
            this.enemies.push(anotherEnemy);
            this.addChild(anotherEnemy);
        }*/

    }
    
}