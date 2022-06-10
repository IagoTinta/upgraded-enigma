import { sound, Sound } from "@pixi/sound";
import { Container, Text, Texture, TilingSprite} from "pixi.js";
import { changeScene, HEIGHT, WIDTH } from "..";
import { Enemy } from "../Game/Npcs/Enemy";
//import { Board } from "../Game/Board";
//import { ScoreAndRating } from "../Game/ScoreAndRating";
//import { WalkingWolf } from "../Game/Npcs/WalkingWolf";
import { Larry } from "../Game/Npcs/Larry";
import { checkCollision} from "../Game/Utils/InterHitbox";
import { InterUpdateable } from "../Game/Utils/InterUpdateable";
import { Wall } from "../Game/WorldObjects/Wall";
import { GameOver } from "./GameOver";

export class FrostWoods extends Container implements InterUpdateable{

    private myLevel: Container;
    private myLarry: Larry;
    private enemies: Enemy[];
    private rightWall: Wall;
    private leftWall: Wall;
    private sowrdHitbox: Wall;
    private gameOver = false;
    private background: TilingSprite[];
    private music: Sound;

    constructor() {

        super();
        
        this.myLevel = new Container();
        this.background = [];
        for (let i=8; i>1; i--) {
            const archivo = "Background" + (i-1);
            const backAux = new TilingSprite(Texture.from(archivo),WIDTH*4000,HEIGHT*4000);
            this.background.push(backAux);
            this.myLevel.addChild(backAux);
        };

        this.rightWall = new Wall(100,1200);
        this.leftWall = new Wall(100,1200);
        this.sowrdHitbox = new Wall(40,20);
        this.rightWall.position.x = 1830;
        this.leftWall.position.x = -80;
        this.myLevel.addChild(this.rightWall, this.leftWall, this.sowrdHitbox);

        this.myLarry = new Larry();
        this.myLarry.position.set(960,900);
        this.myLevel.addChild(this.myLarry);
        this.sowrdHitbox.position.x = this.myLarry.position.x + 60;

        const archivo = "Background" + 1;
        const backAux = new TilingSprite(Texture.from(archivo),WIDTH*40,HEIGHT*40);
        this.background.push(backAux);
        this.myLevel.addChild(backAux);
        
        this.enemies = [];
        const anotherEnemy1 = new Enemy(Math.floor((Math.random()*3)+1));
        anotherEnemy1.position.set(1100,925);
        this.enemies.push(anotherEnemy1);
        this.myLevel.addChild(anotherEnemy1);
        const anotherEnemy2 = new Enemy(Math.floor((Math.random()*3)+1));
        anotherEnemy2.position.set(1100,925);
        this.enemies.push(anotherEnemy2);
        this.myLevel.addChild(anotherEnemy2);
        const anotherEnemy3 = new Enemy(Math.floor((Math.random()*3)+1));
        anotherEnemy3.position.set(1100,925);
        this.enemies.push(anotherEnemy3);
        this.myLevel.addChild(anotherEnemy3);

        const Titulo: Text = new Text("Larry's Adventure Day", {fontSize: 40, fill:0x000000, fontFamily: "Cambria"});
        const Descripcion: Text = new Text("Plataform Autoscroller With Combat", {fontSize: 40, fill:0x000000, fontFamily: "Cambria"});
        Titulo.anchor.set(0.5);
        Descripcion.anchor.set(0.5);
        Titulo.position.set(WIDTH/2,22.5);
        Descripcion.position.set(WIDTH/2,60);

        this.myLevel.scale.x = 0.70;
        this.myLevel.scale.y = 0.68;
        this.addChild(this.myLevel,Titulo,Descripcion);

        this.music = sound.find("FWMusic");
        this.music.play({volume:0.2,singleInstance:true,loop:true});
        this.music.muted = false;
      
    }

    public update (deltaTime: number, _deltaFrame: number):void {

        if (this.gameOver) {
            this.music.muted = true;
            const auxScene = new GameOver();
            changeScene(auxScene);
            return;
        }

        this.myLarry.update(deltaTime);

        if (this.myLarry.speed.x > 0) {
                this.sowrdHitbox.position.x = this.myLarry.position.x + 60;
        } else if (this.myLarry.speed.x < 0) {
            this.sowrdHitbox.position.x = this.myLarry.position.x - 100;
        }
        this.sowrdHitbox.position.y = this.myLarry.position.y - 40;

        for (let enemy of this.enemies) {
            enemy.update(deltaTime);
            const encounter = checkCollision(this.myLarry, enemy);
            const rEnemyWall = checkCollision(enemy,this.rightWall);
            const lEnemyWall = checkCollision(enemy,this.leftWall);
            const hit = checkCollision(enemy,this.sowrdHitbox);
            if (hit != null && this.myLarry.hitting && enemy.damageCheck) {
                enemy.damageCheck = false;
                enemy.receiveDamage(this.myLarry.dealDamage());
            } else {
                enemy.damageCheck = true;
            }
            if (encounter != null && this.myLarry.damageCheck) {
                this.myLarry.receiveDamage(enemy.dealDamage());
                this.myLarry.damageCheck = false;
                enemy.speed.x = 0;
            } else if (encounter != null) {
                this.myLarry.damageCheck = false;
            } else  if (enemy.speed.x == 0) {
                enemy.resumeSpeed();
                this.myLarry.damageCheck = true;
            }

            if (rEnemyWall != null) {
                enemy.separate(rEnemyWall, this.rightWall.position);
                enemy.speed.x = -enemy.speed.x;
            }
            if (lEnemyWall != null) {
                enemy.separate(lEnemyWall, this.leftWall.position);
                enemy.speed.x = -enemy.speed.x;
            }
            if (enemy.isDead()) {
                enemy.destroy();
            }

        }

        this.enemies = this.enemies.filter((elem) => !elem.destroyed);

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
        for (let back of this.background) {
            let cont = this.background.indexOf(back) * 0.2;
            back.tilePosition.x -= this.worldTransform.a * cont;
        }
        this.rightWall.position.x += 0.1425725 * this.worldTransform.a;
        this.leftWall.position.x += 0.1425725 * this.worldTransform.a;

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