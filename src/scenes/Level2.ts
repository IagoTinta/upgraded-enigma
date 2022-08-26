import { BitmapText, Container, NineSlicePlane, Sprite, Text, Texture, TilingSprite } from "pixi.js";
import { Group, Tween } from "tweedle.js";
import { BigEnemy } from "../Game/Npcs/BigEnemy";
import { Spaceship } from "../Game/Npcs/Spaceship";
import { BaseScene } from "../Game/Utils/BaseScene";
import { checkCollision } from "../Game/Utils/InterHitbox";
import { Keyboard } from "../Game/Utils/Keyboard";
import { Manager } from "../Game/Utils/Manager";
import { StateAnimations } from "../Game/Utils/StateAnimations";
import { PowerUp } from "../Game/WorldObjects/PowerUp";
import { Wall } from "../Game/WorldObjects/Wall";
import { GlowFilter } from "@pixi/filter-glow";
import { SmallEnemy } from "../Game/Npcs/SmallEnemy";
import { MediumEnemy } from "../Game/Npcs/MediumEnemy";
import { GameOver } from "./GameOver";
import { Button } from "../Game/Utils/Button";
import { XertacBoss } from "../Game/Npcs/XertacBoss";
import { LevelWon } from "./LevelWon";


export class Level2 extends BaseScene {

    //world
    private world: Container;
    private background: TilingSprite;
    private walls: Wall[];
    private powerup: PowerUp;

    //UI
    private score: Container;
    private scorepoints: BitmapText;
    private lifes: Container;
    private remaininglifes: BitmapText;
    private menuToggle: Sprite;

    //player
    private mySpaceship: Spaceship;
    private proyectiles: Map<StateAnimations,Wall> = new Map();

    //enemies
    private bigEnemies: BigEnemy[];
    private mediumEnemies: MediumEnemy[];
    private smallEnemies: SmallEnemy[];
    private bigEnemyProyectiles: Map<StateAnimations,Wall> = new Map();
    private mediumEnemyProyectiles: Map<StateAnimations,Wall> = new Map();
    private smallEnemyProyectiles: Map<StateAnimations,Wall> = new Map();
    private bossProyectiles: Map<StateAnimations,Wall> = new Map();
    private boss: XertacBoss;

    //effects
    private playerLaserGlow: GlowFilter;

    //miscellaneous
    private PUactive: boolean = false;
    private onMenu: boolean = false;
    private pauseMenu: Container;
    private bossSpawned: boolean = false;
    private respawning = false;
    private win = false;

    constructor() {

        super();

        Manager.playMusic("Level2Music");

        this.world = new Container;
        this.background = new TilingSprite(Texture.from("level2Background"), Manager.WIDTH, Manager.HEIGHT);
        this.mySpaceship = new Spaceship();
        this.mySpaceship.position.set(Manager.WIDTH/4,Manager.HEIGHT/2);

        this.playerLaserGlow = new GlowFilter();
        switch (Manager.getType()) {
            case 1:
                this.playerLaserGlow = new GlowFilter({color: LaserGlowFilterColor.one});
                break;
        
            case 2:
                this.playerLaserGlow = new GlowFilter({color: LaserGlowFilterColor.two});
                break;
        
            case 3:
                this.playerLaserGlow = new GlowFilter({color: LaserGlowFilterColor.three});
                break;
        
            case 4:
                this.playerLaserGlow = new GlowFilter({color: LaserGlowFilterColor.four});
                break;
        
            case 5:
                this.playerLaserGlow = new GlowFilter({color: LaserGlowFilterColor.five});
                break;
        
            case 6:
                this.playerLaserGlow = new GlowFilter({color: LaserGlowFilterColor.six});
                break;
        
            default:
                break;
        }
        
        this.walls = [];
        const leftWall = new Wall(20,Manager.HEIGHT);
        const rightWall = new Wall(20,Manager.HEIGHT);
        rightWall.position.x = Manager.WIDTH-20;
        const topWall = new Wall(Manager.WIDTH,10);
        const bottomWall = new Wall(Manager.WIDTH,10);
        bottomWall.position.y = Manager.HEIGHT-10;
        this.walls.push(leftWall, rightWall, topWall, bottomWall);
        
        this.powerup = new PowerUp();
        
        this.addChild(
            this.background, 
            this.world,
            this.mySpaceship,
        );

        this.bigEnemies = [];
        for (let i = 0; i<3; i++) {
            const newBE = new BigEnemy(2);
            this.respawnEnemy(newBE);
            this.bigEnemies.push(newBE);
            this.addChild(newBE);
        }
        this.mediumEnemies = [];
        for (let i = 0; i<6; i++) {
            const newME = new MediumEnemy(2);
            this.respawnEnemy(newME);
            this.mediumEnemies.push(newME);
            this.addChild(newME);
        }
        this.smallEnemies = [];
        for (let i = 0; i<10; i++) {
            const newSE = new SmallEnemy(2);
            this.respawnEnemy(newSE);
            this.smallEnemies.push(newSE);
            this.addChild(newSE);
        }
        this.boss = new XertacBoss();

        this.addChild(
            leftWall,
            rightWall,
            topWall,
            bottomWall
        );

        this.pauseMenu = new Container();

        const pauseBoard = new NineSlicePlane(Texture.from("Board"),35,35,35,35);
        const pauseBoardtittle = new NineSlicePlane(Texture.from("Tittle"),35,35,35,35);
        const pauseTittle: Text = new Text("Pause", Manager.TEXT_STYLE);
        this.pauseMenu.addChild(pauseBoard,pauseBoardtittle,pauseTittle);
        pauseBoardtittle.position.set(166,-50);
        pauseTittle.anchor.set(0.5);
        pauseTittle.position.set(522.5,15);
        this.pauseMenu.scale.set(0);
        this.pauseMenu.pivot.set(522.5,358);
        this.pauseMenu.position.set(Manager.WIDTH/2,Manager.HEIGHT/2);

        const resume = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        resume.position.set(272.5,250);
        const resumeText: Text = new Text("Resume", Manager.TEXT_STYLE);
        resumeText.anchor.set(0.5);
        resumeText.position.copyFrom(resume);
        resume.on(Button.CLICKED_EVENT,this.showMenu,this);
        const muteMusic = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        muteMusic.position.set(272.5,500);
        const muteMusicText: Text = new Text("Mute Music", Manager.TEXT_STYLE);
        muteMusicText.anchor.set(0.5);
        muteMusicText.position.copyFrom(muteMusic);
        muteMusic.on(Button.CLICKED_EVENT,this.muteMusic,this);
        const back2Menu = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        back2Menu.position.set(772.5,250);
        const b2mText: Text = new Text("Back to \n Main Menu", Manager.TEXT_STYLE);
        b2mText.anchor.set(0.5);
        b2mText.position.copyFrom(back2Menu);
        const muteSFX = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        muteSFX.position.set(772.5,500);
        const muteSFXText: Text = new Text("Mute SFX", Manager.TEXT_STYLE);
        muteSFXText.anchor.set(0.5);
        muteSFXText.position.copyFrom(muteSFX);
        muteSFX.on(Button.CLICKED_EVENT,this.muteSFX,this);
        this.pauseMenu.addChild(resume,resumeText,muteSFX,muteSFXText,muteMusic,muteMusicText,back2Menu,b2mText);

        this.score = new Container();
        const scoretext = new Text("Score : ", Manager.TEXT_STYLE);
        this.scorepoints = new BitmapText("0", {fontName: "BitmapPixelText"});
        this.scorepoints.scale.set(0.75);
        this.scorepoints.position.set(scoretext.x+167.5,scoretext.y+30);
        this.score.addChild(scoretext, this.scorepoints);
        this.score.y = -15;
        this.score.scale.set(0.7);
        this.addChild(this.score);

        this.lifes = new Container();
        const lifesShip:Sprite = Sprite.from("Spaceship3.png");
        this.remaininglifes = new BitmapText(" :" + this.mySpaceship.getLifes().toString(), {fontName: "BitmapPixelText"});
        this.remaininglifes.position.set(90,30);
        this.lifes.addChild(lifesShip,this.remaininglifes);
        this.lifes.scale.set(0.6);
        this.lifes.position.y = Manager.HEIGHT-100;
        this.addChild(this.lifes);

        this.menuToggle = Sprite.from("menuToggle");
        this.menuToggle.position.set(Manager.WIDTH-100, 20);
        this.menuToggle.scale.set(0.5);
        this.menuToggle.interactive = true;
        this.menuToggle.on("pointerdown", this.showMenu, this);
        this.addChild(this.menuToggle);

        new Tween({dc:0}).
        to({dc:1}, 300000).
        onComplete(()=>{this.spawnBoss()}).
        start();
            
        Keyboard.down.on("Space", this.shoot, this);
        Keyboard.down.on("Escape",this.showMenu, this);
            
    }

    public override destroy(options: any) {
        Keyboard.down.off("Space", this.shoot);
        Keyboard.down.off("Escape",this.showMenu);
        super.destroy(options);
    }

    public update (deltaTime: number, _deltaFrame: number):void {

        this.addChildAt(this.lifes, this.children.length-1);
        this.addChildAt(this.score, this.children.length-1);
        this.addChildAt(this.menuToggle, this.children.length-1);

        if (!this.onMenu) {
            this.mySpaceship.update(deltaTime);
            this.powerup.updateAnim(deltaTime);
            this.world.x -= 0.1 * this.worldTransform.a;
            this.background.tilePosition.x = this.world.x * 10;
            this.boss.update(deltaTime);

            this.remaininglifes.text = " :" + this.mySpaceship.getLifes().toString();
    
            for (let wall of this.walls) {
                const limit = checkCollision(this.mySpaceship,wall);
                if (limit != null && this.mySpaceship.tangible) {
                    this.mySpaceship.separate(limit,wall.position);
                    this.mySpaceship.speed.set(0,0);
                }
            }
            if (this.respawning && !this.mySpaceship.tangible && !this.mySpaceship.isDead()) {
                this.respawning = false;
                new Tween({dc:0}).
                to({dc:1}, 400).
                onComplete(()=>{
                    this.mySpaceship.respawn();
                    this.respawnShip();
                }).
                start();
            }
            for (let proy of this.proyectiles.keys()) {
                proy.updateAnim(deltaTime);
                const hx = this.proyectiles.get(proy);
                proy.x += 30;
                if (hx) {
                    hx.position.copyFrom(proy);
                    for (let enemy of this.bigEnemies) {
                        const hitEnemy = checkCollision(hx,enemy);
                        if (hitEnemy != null) {
                            proy.playState("landed");
                            proy.x -= 30;
                            enemy.receiveDamage(this.mySpaceship.dealDamage());
                            new Tween({dc:0}).
                            to({dc:1},1).
                            onComplete(()=>{this.destProy(this.proyectiles,proy,hx)}).
                            start();
                        }
                    }
                    for (let enemy of this.mediumEnemies) {
                        const hitEnemy = checkCollision(hx,enemy);
                        if (hitEnemy != null) {
                            proy.playState("landed");
                            proy.x -= 30;
                            enemy.receiveDamage(this.mySpaceship.dealDamage());
                            new Tween({dc:0}).
                            to({dc:1},1).
                            onComplete(()=>{this.destProy(this.proyectiles,proy,hx)}).
                            start();
                        }
                    }
                    for (let enemy of this.smallEnemies) {
                        const hitEnemy = checkCollision(hx,enemy);
                        if (hitEnemy != null) {
                            proy.playState("landed");
                            proy.x -= 30;
                            enemy.receiveDamage(this.mySpaceship.dealDamage());
                            new Tween({dc:0}).
                            to({dc:1},1).
                            onComplete(()=>{this.destProy(this.proyectiles,proy,hx)}).
                            start();
                        }
                    }
                    const hitBoss = checkCollision(hx, this.boss);
                    if (hitBoss != null && this.bossSpawned && !this.boss.isDead()) {
                        proy.playState("landed");
                        proy.x -= 30;
                        this.boss.receiveDamage(this.mySpaceship.dealDamage());
                        new Tween({dc:0}).
                        to({dc:1},1).
                        onComplete(()=>{this.destProy(this.proyectiles,proy,hx)}).
                        start();
                    }
                    const hitPU = checkCollision(hx,this.powerup);
                    if (hitPU != null && !this.powerup.pickeable) {
                        Manager.playSFX("EnemyExplosion");
                        proy.playState("landed");
                        proy.x -= 30;
                        this.powerup.explode();
                        new Tween({dc:0}).
                        to({dc:1},1).
                        onComplete(()=>{this.destProy(this.proyectiles,proy,hx)}).
                        start();
                    }
                }
                if (proy.x > Manager.WIDTH+(-this.world.x)) {
                    this.destProy(this.proyectiles,proy,hx);
                }
            }
            for (let beproy of this.bigEnemyProyectiles.keys()) {
                beproy.updateAnim(deltaTime);
                const ehx = this.bigEnemyProyectiles.get(beproy);
                beproy.x -= 3.5;
                if (ehx) {
                    ehx.position.copyFrom(beproy);
                    const hit = checkCollision(ehx,this.mySpaceship);
                    if (hit != null) {
                        beproy.playState("landed");
                        beproy.x += 5;
                        this.mySpaceship.explode();
                        if (!this.mySpaceship.tangible) {
                            this.respawning = true;
                        }
                        new Tween({dc:0}).
                        to({dc:1},1).
                        onComplete(()=>{this.destProy(this.bigEnemyProyectiles,beproy,ehx)}).
                        start();
                    }
                }
                if (beproy.x < -100) {
                    this.destProy(this.bigEnemyProyectiles,beproy,ehx);
                }
            }
            for (let meproy of this.mediumEnemyProyectiles.keys()) {
                meproy.updateAnim(deltaTime);
                const ehx = this.mediumEnemyProyectiles.get(meproy);
                meproy.x -= 3.5;
                if (ehx) {
                    ehx.position.copyFrom(meproy);
                    const hit = checkCollision(ehx,this.mySpaceship);
                    if (hit != null) {
                        meproy.playState("landed");
                        meproy.x += 5;
                        this.mySpaceship.explode();
                        if (!this.mySpaceship.tangible) {
                            this.respawning = true;
                        }
                        new Tween({dc:0}).
                        to({dc:1},1).
                        onComplete(()=>{this.destProy(this.mediumEnemyProyectiles,meproy,ehx)}).
                        start();
                    }
                }
                if (meproy.x < -100) {
                    this.destProy(this.mediumEnemyProyectiles,meproy,ehx);
                }
            }
            for (let seproy of this.smallEnemyProyectiles.keys()) {
                seproy.updateAnim(deltaTime);
                const ehx = this.smallEnemyProyectiles.get(seproy);
                seproy.x -= 3.5;
                if (ehx) {
                    ehx.position.copyFrom(seproy);
                    const hit = checkCollision(ehx,this.mySpaceship);
                    if (hit != null) {
                        seproy.playState("landed");
                        seproy.x += 5;
                        this.mySpaceship.explode();
                        if (!this.mySpaceship.tangible) {
                            this.respawning = true;
                        }
                        new Tween({dc:0}).
                        to({dc:1},1).
                        onComplete(()=>{this.destProy(this.smallEnemyProyectiles,seproy,ehx)}).
                        start();
                    }
                }
                if (seproy.x < -100) {
                    this.destProy(this.smallEnemyProyectiles,seproy,ehx);
                }
            }

            for (let enemy of this.bigEnemies) {
                if (enemy.bigEnemyDead) {
                    this.removeChild(enemy);
                    this.respawnEnemy(enemy);
                    this.addScore(50);
                } else {
                    enemy.update(deltaTime);
                    this.bigEnemyShoot(enemy)
                    if (enemy.position.x < -200 || enemy.position.y > Manager.HEIGHT+600 || enemy.position.y < -600) {
                        this.respawnEnemy(enemy);
                    }
                }
            }
            for (let enemy of this.mediumEnemies) {
                if (enemy.mediumEnemyDead) {
                    this.removeChild(enemy);
                    this.respawnEnemy(enemy);
                    this.addScore(35);
                } else {
                    enemy.update(deltaTime);
                    this.mediumEnemyShoot(enemy)
                    if (enemy.position.x < -200 || enemy.position.y > Manager.HEIGHT+600 || enemy.position.y < -600) {
                        this.respawnEnemy(enemy);
                    }
                }
            }
            for (let enemy of this.smallEnemies) {
                if (enemy.smallEnemyDead) {
                    this.removeChild(enemy);
                    this.respawnEnemy(enemy);
                    this.addScore(10);
                } else {
                    enemy.update(deltaTime);
                    this.smallEnemyShoot(enemy)
                    if (enemy.position.x < -200 || enemy.position.y > Manager.HEIGHT+600 || enemy.position.y < -600) {
                        this.respawnEnemy(enemy);
                    }
                }
            }
    
            if (!this.PUactive) {
                this.PUactive = true;
                const timer = new Tween({dc:1}).
                to({dc:1}, 90000).
                onStart(()=>{
                    this.powerup.position.set(Manager.WIDTH+100,Math.random()*500+100);
                    this.powerup.respawn();
                    this.addChild(this.powerup);
                }).
                onUpdate(()=>{
                    this.powerup.x--;
                    const picked = checkCollision(this.mySpaceship, this.powerup);
                    if (picked != null && this.powerup.pickeable) {
                        Manager.playSFX("PowerUp");
                        this.removeChild(this.powerup);
                        this.powerup.pickeable = false;
                        this.mySpaceship.getBonus(this.powerup.bonus);
                    }
                }).
                onComplete(()=>{
                    timer.restart();
                    this.PUactive = false;
                }).
                start();
            }
    
            if (this.mySpaceship.isDead()) {
                this.gameover();
            }

            if (this.boss.isActive() && !this.boss.isDead()) {
                this.bossShoot(this.boss);
                if (this.boss.y < 100) {
                    this.boss.changeSpeed();
                }
                if (this.boss.y > 620) {
                    this.boss.changeSpeed();
                }
            } else if (this.boss.exploding) {
                this.boss.speed.y = 0;
            }
            if (this.boss.isDead() && !this.win) {
                this.levelWon();
                this.win = false;
            }

            for (let bossproy of this.bossProyectiles.keys()) {
                bossproy.updateAnim(deltaTime);
                const bosshx = this.bossProyectiles.get(bossproy);
                bossproy.x -= 3.5;
                if (bosshx) {
                    bosshx.position.copyFrom(bossproy);
                    const hit = checkCollision(bosshx,this.mySpaceship);
                    if (hit != null) {
                        bossproy.playState("landed");
                        bossproy.x += 5;
                        this.mySpaceship.explode();
                        if (!this.mySpaceship.tangible) {
                            this.respawning = true;
                        }
                        new Tween({dc:0}).
                        to({dc:1},1).
                        onComplete(()=>{this.destProy(this.bossProyectiles,bossproy,bosshx)}).
                        start();
                    }
                }
                if (bossproy.x < -100) {
                    this.destProy(this.bossProyectiles,bossproy,bosshx);
                }
            }
        }
    }

    public respawnEnemy(enemy: BigEnemy | SmallEnemy | MediumEnemy) {
        if (!this.bossSpawned) {
            if (enemy instanceof BigEnemy) {
                new Tween({dc:0}).
                to({dc:1}, 2000).
                onComplete(()=>{
                    enemy.respawn();
                    enemy.position.set(Manager.WIDTH+(Math.random()*200)+50, Math.random()*(Manager.HEIGHT+600)-300);
                    if (enemy.position.y < Manager.HEIGHT/4) {
                        enemy.speed.y = 35;
                    }
                    if (enemy.position.y > (Manager.HEIGHT * (3/4))) {
                        enemy.speed.y = -35;
                    }
                    this.addChild(enemy);
                }).
                start();
            }
            if (enemy instanceof MediumEnemy) {
                new Tween({dc:0}).
                to({dc:1}, 1000).
                onComplete(()=>{
                    enemy.respawn();
                    enemy.position.set(Manager.WIDTH+(Math.random()*200)+50, Math.random()*(Manager.HEIGHT+600)-300);
                    if (enemy.position.y < Manager.HEIGHT/4) {
                        enemy.speed.y = 50;
                    }
                    if (enemy.position.y > (Manager.HEIGHT * (3/4))) {
                        enemy.speed.y = -50;
                    }
                    this.addChild(enemy);
                }).
                start();
            }
            if (enemy instanceof SmallEnemy) {
                new Tween({dc:0}).
                to({dc:1}, 500).
                onComplete(()=>{
                    enemy.respawn();
                    enemy.position.set(Manager.WIDTH+(Math.random()*200)+50, Math.random()*(Manager.HEIGHT+600)-300);
                    if (enemy.position.y < Manager.HEIGHT/4) {
                        enemy.speed.y = 90;
                    }
                    if (enemy.position.y > (Manager.HEIGHT * (3/4))) {
                        enemy.speed.y = -90;
                    }
                    this.addChild(enemy);
                }).
                start();
            }
        }
    }

    public shoot() {
        if (!this.mySpaceship.isShooting() && !this.mySpaceship.isDead()) {
            Manager.playSFX("SsLaser");
            this.mySpaceship.shoot();
            const proyectile = new StateAnimations();
            switch (Manager.getType()) {
                case 1:
                    proyectile.addState("shoted",["proyectile1.png"], 0.5);
                    proyectile.addState("landed", [
                        "shot1_exp1.png",
                        "shot1_exp2.png",
                        "shot1_exp3.png",
                        "shot1_exp4.png",
                        "shot1_exp5.png"
                    ], 0.5, false);
                    
                    break;
            
                case 2:
                    proyectile.addState("shoted",["proyectile2.png"], 0.5);
                    proyectile.addState("landed", [
                        "shot2_exp1.png",
                        "shot2_exp2.png",
                        "shot2_exp3.png",
                        "shot2_exp4.png",
                        "shot2_exp5.png"
                    ], 0.5, false);
                    
                    break;
            
                case 3:
                    proyectile.addState("shoted",["proyectile3.png"], 0.5);
                    proyectile.addState("landed", [
                        "shot3_exp1.png",
                        "shot3_exp2.png",
                        "shot3_exp3.png",
                        "shot3_exp4.png"
                    ], 0.5, false);
                    
                    break;
            
                case 4:
                    proyectile.addState("shoted",["proyectile4.png"], 0.5);
                    proyectile.addState("landed", [
                        "shot4_exp1.png",
                        "shot4_exp2.png",
                        "shot4_exp3.png",
                        "shot4_exp4.png",
                        "shot4_exp5.png",
                        "shot4_exp6.png",
                        "shot4_exp7.png",
                        "shot4_exp8.png",
                    ], 0.5, false);
                    
                    break;
            
                case 5:
                    proyectile.addState("shoted",["proyectile5.png"], 0.5);
                    proyectile.addState("landed", [
                        "shot5_exp1.png",
                        "shot5_exp2.png",
                        "shot5_exp3.png",
                        "shot5_exp4.png",
                        "shot5_exp5.png",
                        "shot5_exp6.png",
                        "shot5_exp7.png",
                        "shot5_exp8.png"
                    ], 0.5, false);
                    
                    break;
            
                case 6:
                    proyectile.addState("shoted",["proyectile6.png"], 0.5);
                    proyectile.addState("landed", [
                        "shot6_exp1.png",
                        "shot6_exp2.png",
                        "shot6_exp3.png",
                        "shot6_exp4.png",
                        "shot6_exp5.png",
                        "shot6_exp6.png",
                        "shot6_exp7.png",
                        "shot6_exp8.png",
                        "shot6_exp9.png",
                        "shot6_exp10.png"
                    ], 0.5, false);
                    
                    break;
            
                default:
                    proyectile.addState("shoted",["proyectile3.png"], 0.5);
                    proyectile.addState("landed", [
                        "shot3_exp1.png",
                        "shot3_exp2.png",
                        "shot3_exp3.png",
                        "shot3_exp4.png"
                    ], 0.5, false);
                    
                    break;
            }
            proyectile.playState("shoted");
            proyectile.position.set(this.mySpaceship.x+40, this.mySpaceship.y+5);
            if (this.mySpaceship.hasDammageUp()) {
                console.log(this.mySpaceship.hasDammageUp());
                proyectile.filters = [this.playerLaserGlow];
            }
            const proyHx = new Wall(13,13);
            proyHx.pivot.set(proyHx.width/2, proyHx.height/2);
            proyHx.position.copyFrom(proyectile);
            this.addChild(proyectile,proyHx);
            this.proyectiles.set(proyectile,proyHx);
        }
    }

    private bigEnemyShoot(enemy: BigEnemy) {
        if (!enemy.bigShooting) {
            enemy.bigShooting = true;
            const proyectile = new StateAnimations();
            switch (Manager.getType()) {
                case 1:
                    proyectile.addState("shoted",["proyectile1.png"], 0.5);
                    proyectile.addState("landed", [
                        "shot1_exp1.png",
                        "shot1_exp2.png",
                        "shot1_exp3.png",
                        "shot1_exp4.png",
                        "shot1_exp5.png"
                    ], 0.5, false);
                    
                    break;
            
                case 2:
                    proyectile.addState("shoted",["proyectile2.png"], 0.5);
                    proyectile.addState("landed", [
                        "shot2_exp1.png",
                        "shot2_exp2.png",
                        "shot2_exp3.png",
                        "shot2_exp4.png",
                        "shot2_exp5.png"
                    ], 0.5, false);
                    
                    break;
            
                case 3:
                    proyectile.addState("shoted",["proyectile3.png"], 0.5);
                    proyectile.addState("landed", [
                        "shot3_exp1.png",
                        "shot3_exp2.png",
                        "shot3_exp3.png",
                        "shot3_exp4.png"
                    ], 0.5, false);
                    
                    break;
            
                case 4:
                    proyectile.addState("shoted",["proyectile4.png"], 0.5);
                    proyectile.addState("landed", [
                        "shot4_exp1.png",
                        "shot4_exp2.png",
                        "shot4_exp3.png",
                        "shot4_exp4.png",
                        "shot4_exp5.png",
                        "shot4_exp6.png",
                        "shot4_exp7.png",
                        "shot4_exp8.png",
                    ], 0.5, false);
                    
                    break;
            
                case 5:
                    proyectile.addState("shoted",["proyectile5.png"], 0.5);
                    proyectile.addState("landed", [
                        "shot5_exp1.png",
                        "shot5_exp2.png",
                        "shot5_exp3.png",
                        "shot5_exp4.png",
                        "shot5_exp5.png",
                        "shot5_exp6.png",
                        "shot5_exp7.png",
                        "shot5_exp8.png"
                    ], 0.5, false);
                    
                    break;
            
                case 6:
                    proyectile.addState("shoted",["proyectile6.png"], 0.5);
                    proyectile.addState("landed", [
                        "shot6_exp1.png",
                        "shot6_exp2.png",
                        "shot6_exp3.png",
                        "shot6_exp4.png",
                        "shot6_exp5.png",
                        "shot6_exp6.png",
                        "shot6_exp7.png",
                        "shot6_exp8.png",
                        "shot6_exp9.png",
                        "shot6_exp10.png"
                    ], 0.5, false);
                    
                    break;
            
                default:
                    proyectile.addState("shoted",["proyectile3.png"], 0.5);
                    proyectile.addState("landed", [
                        "shot3_exp1.png",
                        "shot3_exp2.png",
                        "shot3_exp3.png",
                        "shot3_exp4.png"
                    ], 0.5, false);
                    
                    break;
            }
            proyectile.playState("shoted");
            proyectile.position.set(enemy.x, enemy.y);
            const proyHx = new Wall(13,13);
            proyHx.pivot.set(proyHx.width/2, proyHx.height/2);
            proyHx.position.copyFrom(proyectile);
            this.addChild(proyectile,proyHx);
            this.bigEnemyProyectiles.set(proyectile,proyHx);
            new Tween({dc:0}).
            to({dc:1}, 5000).
            onComplete(()=>{enemy.bigShooting = false}).
            start();
        }
    }
    private mediumEnemyShoot(enemy: MediumEnemy) {
        if (!enemy.mediumShooting) {
            enemy.mediumShooting = true;
            const proyectile = new StateAnimations();
            switch (Manager.getType()) {
                case 1:
                    proyectile.addState("shoted",["proyectile1.png"], 0.5);
                    proyectile.addState("landed", [
                        "shot1_exp1.png",
                        "shot1_exp2.png",
                        "shot1_exp3.png",
                        "shot1_exp4.png",
                        "shot1_exp5.png"
                    ], 0.5, false);
                    
                    break;
            
                case 2:
                    proyectile.addState("shoted",["proyectile2.png"], 0.5);
                    proyectile.addState("landed", [
                        "shot2_exp1.png",
                        "shot2_exp2.png",
                        "shot2_exp3.png",
                        "shot2_exp4.png",
                        "shot2_exp5.png"
                    ], 0.5, false);
                    
                    break;
            
                case 3:
                    proyectile.addState("shoted",["proyectile3.png"], 0.5);
                    proyectile.addState("landed", [
                        "shot3_exp1.png",
                        "shot3_exp2.png",
                        "shot3_exp3.png",
                        "shot3_exp4.png"
                    ], 0.5, false);
                    
                    break;
            
                case 4:
                    proyectile.addState("shoted",["proyectile4.png"], 0.5);
                    proyectile.addState("landed", [
                        "shot4_exp1.png",
                        "shot4_exp2.png",
                        "shot4_exp3.png",
                        "shot4_exp4.png",
                        "shot4_exp5.png",
                        "shot4_exp6.png",
                        "shot4_exp7.png",
                        "shot4_exp8.png",
                    ], 0.5, false);
                    
                    break;
            
                case 5:
                    proyectile.addState("shoted",["proyectile5.png"], 0.5);
                    proyectile.addState("landed", [
                        "shot5_exp1.png",
                        "shot5_exp2.png",
                        "shot5_exp3.png",
                        "shot5_exp4.png",
                        "shot5_exp5.png",
                        "shot5_exp6.png",
                        "shot5_exp7.png",
                        "shot5_exp8.png"
                    ], 0.5, false);
                    
                    break;
            
                case 6:
                    proyectile.addState("shoted",["proyectile6.png"], 0.5);
                    proyectile.addState("landed", [
                        "shot6_exp1.png",
                        "shot6_exp2.png",
                        "shot6_exp3.png",
                        "shot6_exp4.png",
                        "shot6_exp5.png",
                        "shot6_exp6.png",
                        "shot6_exp7.png",
                        "shot6_exp8.png",
                        "shot6_exp9.png",
                        "shot6_exp10.png"
                    ], 0.5, false);
                    
                    break;
            
                default:
                    proyectile.addState("shoted",["proyectile3.png"], 0.5);
                    proyectile.addState("landed", [
                        "shot3_exp1.png",
                        "shot3_exp2.png",
                        "shot3_exp3.png",
                        "shot3_exp4.png"
                    ], 0.5, false);
                    
                    break;
            }
            proyectile.playState("shoted");
            proyectile.position.set(enemy.x, enemy.y);
            const proyHx = new Wall(13,13);
            proyHx.pivot.set(proyHx.width/2, proyHx.height/2);
            proyHx.position.copyFrom(proyectile);
            this.addChild(proyectile,proyHx);
            this.mediumEnemyProyectiles.set(proyectile,proyHx);
            new Tween({dc:0}).
            to({dc:1}, 3000).
            onComplete(()=>{enemy.mediumShooting = false}).
            start();
        }
    }
    private smallEnemyShoot(enemy: SmallEnemy) {
        if (!enemy.smallShooting) {
            enemy.smallShooting = true;
            const proyectile = new StateAnimations();
            switch (Manager.getType()) {
                case 1:
                    proyectile.addState("shoted",["proyectile1.png"], 0.5);
                    proyectile.addState("landed", [
                        "shot1_exp1.png",
                        "shot1_exp2.png",
                        "shot1_exp3.png",
                        "shot1_exp4.png",
                        "shot1_exp5.png"
                    ], 0.5, false);
                    
                    break;
            
                case 2:
                    proyectile.addState("shoted",["proyectile2.png"], 0.5);
                    proyectile.addState("landed", [
                        "shot2_exp1.png",
                        "shot2_exp2.png",
                        "shot2_exp3.png",
                        "shot2_exp4.png",
                        "shot2_exp5.png"
                    ], 0.5, false);
                    
                    break;
            
                case 3:
                    proyectile.addState("shoted",["proyectile3.png"], 0.5);
                    proyectile.addState("landed", [
                        "shot3_exp1.png",
                        "shot3_exp2.png",
                        "shot3_exp3.png",
                        "shot3_exp4.png"
                    ], 0.5, false);
                    
                    break;
            
                case 4:
                    proyectile.addState("shoted",["proyectile4.png"], 0.5);
                    proyectile.addState("landed", [
                        "shot4_exp1.png",
                        "shot4_exp2.png",
                        "shot4_exp3.png",
                        "shot4_exp4.png",
                        "shot4_exp5.png",
                        "shot4_exp6.png",
                        "shot4_exp7.png",
                        "shot4_exp8.png",
                    ], 0.5, false);
                    
                    break;
            
                case 5:
                    proyectile.addState("shoted",["proyectile5.png"], 0.5);
                    proyectile.addState("landed", [
                        "shot5_exp1.png",
                        "shot5_exp2.png",
                        "shot5_exp3.png",
                        "shot5_exp4.png",
                        "shot5_exp5.png",
                        "shot5_exp6.png",
                        "shot5_exp7.png",
                        "shot5_exp8.png"
                    ], 0.5, false);
                    
                    break;
            
                case 6:
                    proyectile.addState("shoted",["proyectile6.png"], 0.5);
                    proyectile.addState("landed", [
                        "shot6_exp1.png",
                        "shot6_exp2.png",
                        "shot6_exp3.png",
                        "shot6_exp4.png",
                        "shot6_exp5.png",
                        "shot6_exp6.png",
                        "shot6_exp7.png",
                        "shot6_exp8.png",
                        "shot6_exp9.png",
                        "shot6_exp10.png"
                    ], 0.5, false);
                    
                    break;
            
                default:
                    proyectile.addState("shoted",["proyectile3.png"], 0.5);
                    proyectile.addState("landed", [
                        "shot3_exp1.png",
                        "shot3_exp2.png",
                        "shot3_exp3.png",
                        "shot3_exp4.png"
                    ], 0.5, false);
                    
                    break;
            }
            proyectile.playState("shoted");
            proyectile.position.set(enemy.x, enemy.y);
            const proyHx = new Wall(13,13);
            proyHx.pivot.set(proyHx.width/2, proyHx.height/2);
            proyHx.position.copyFrom(proyectile);
            this.addChild(proyectile,proyHx);
            this.smallEnemyProyectiles.set(proyectile,proyHx);
            new Tween({dc:0}).
            to({dc:1}, 2000).
            onComplete(()=>{enemy.smallShooting = false}).
            start();
        }
    }
    private bossShoot(boss: XertacBoss) {
        if (!boss.bossShooting) {
            boss.bossShooting = true;
            
            const proyectile1 = new StateAnimations();
            proyectile1.addState("shoted",
            [
                "BPF1.png",
                "BPF2.png",
                "BPF3.png",
                "BPF4.png",
                "BPF5.png",
                "BPF6.png",
                "BPF7.png",
                "BPF8.png",
                "BPF9.png",
                "BPF10.png"
            ], 0.5, true);
            proyectile1.addState("landed", [
                "BPE1.png",
                "BPE2.png",
                "BPE3.png",
                "BPE4.png",
                "BPE5.png",
                "BPE6.png",
                "BPE7.png",
                "BPE8.png",
                "BPE9.png"
            ], 0.5, false);
            proyectile1.playState("shoted");
            proyectile1.rotation = Math.PI*3/2;
            proyectile1.scale.set(0.1);
            proyectile1.position.set(boss.x-95, boss.y);
            const proyHx1 = new Wall(51.7,14.1);
            proyHx1.pivot.set(proyHx1.width/2, proyHx1.height/2);
            proyHx1.position.copyFrom(proyectile1);

            const proyectile2 = new StateAnimations();
            proyectile2.addState("shoted",
            [
                "BPF1.png",
                "BPF2.png",
                "BPF3.png",
                "BPF4.png",
                "BPF5.png",
                "BPF6.png",
                "BPF7.png",
                "BPF8.png",
                "BPF9.png",
                "BPF10.png"
            ], 0.5, true);
            proyectile2.addState("landed", [
                "BPE1.png",
                "BPE2.png",
                "BPE3.png",
                "BPE4.png",
                "BPE5.png",
                "BPE6.png",
                "BPE7.png",
                "BPE8.png",
                "BPE9.png"
            ], 0.5, false);
            proyectile2.playState("shoted");
            proyectile2.rotation = Math.PI*3/2;
            const proyHx2 = new Wall(51.7,14.1);
            proyHx2.pivot.set(proyHx2.width/2, proyHx2.height/2);
            proyHx2.position.copyFrom(proyectile2);
            proyectile2.scale.set(0.1);
            proyectile2.position.set(boss.x-55, boss.y-90);

            const proyectile3 = new StateAnimations();
            proyectile3.addState("shoted",
            [
                "BPF1.png",
                "BPF2.png",
                "BPF3.png",
                "BPF4.png",
                "BPF5.png",
                "BPF6.png",
                "BPF7.png",
                "BPF8.png",
                "BPF9.png",
                "BPF10.png"
            ], 0.5, true);
            proyectile3.addState("landed", [
                "BPE1.png",
                "BPE2.png",
                "BPE3.png",
                "BPE4.png",
                "BPE5.png",
                "BPE6.png",
                "BPE7.png",
                "BPE8.png",
                "BPE9.png"
            ], 0.5, false);
            proyectile3.playState("shoted");
            const proyHx3 = new Wall(51.7,14.1);
            proyHx3.pivot.set(proyHx3.width/2, proyHx3.height/2);
            proyHx3.position.copyFrom(proyectile3);
            proyectile3.rotation = Math.PI*3/2;
            proyectile3.scale.set(0.1);
            proyectile3.position.set(boss.x-55, boss.y+90);

            const proyectile4 = new StateAnimations();
            proyectile4.addState("shoted",
            [
                "BPF1.png",
                "BPF2.png",
                "BPF3.png",
                "BPF4.png",
                "BPF5.png",
                "BPF6.png",
                "BPF7.png",
                "BPF8.png",
                "BPF9.png",
                "BPF10.png"
            ], 0.5, true);
            proyectile4.addState("landed", [
                "BPE1.png",
                "BPE2.png",
                "BPE3.png",
                "BPE4.png",
                "BPE5.png",
                "BPE6.png",
                "BPE7.png",
                "BPE8.png",
                "BPE9.png"
            ], 0.5, false);
            proyectile4.playState("shoted");
            proyectile4.rotation = Math.PI*3/2;
            proyectile4.scale.set(0.1);
            proyectile4.position.set(boss.x-30, boss.y+180);
            const proyHx4 = new Wall(51.7,14.1);
            proyHx4.pivot.set(proyHx4.width/2, proyHx4.height/2);
            proyHx4.position.copyFrom(proyectile4);

            const proyectile5 = new StateAnimations();
            proyectile5.addState("shoted",
            [
                "BPF1.png",
                "BPF2.png",
                "BPF3.png",
                "BPF4.png",
                "BPF5.png",
                "BPF6.png",
                "BPF7.png",
                "BPF8.png",
                "BPF9.png",
                "BPF10.png"
            ], 0.5, true);
            proyectile5.addState("landed", [
                "BPE1.png",
                "BPE2.png",
                "BPE3.png",
                "BPE4.png",
                "BPE5.png",
                "BPE6.png",
                "BPE7.png",
                "BPE8.png",
                "BPE9.png"
            ], 0.5, false);
            proyectile5.playState("shoted");
            proyectile5.rotation = Math.PI*3/2;
            proyectile5.scale.set(0.1);
            proyectile5.position.set(boss.x-30, boss.y-180);
            const proyHx5 = new Wall(51.7,14.1);
            proyHx5.pivot.set(proyHx5.width/2, proyHx5.height/2);
            proyHx5.position.copyFrom(proyectile5);
            
            this.addChild(proyectile1,proyHx1,proyectile2,proyHx2,proyectile3,proyHx3,proyectile4,proyHx4,proyectile5,proyHx5);
            this.bossProyectiles.set(proyectile1,proyHx1);
            this.bossProyectiles.set(proyectile2,proyHx2);
            this.bossProyectiles.set(proyectile3,proyHx3);
            this.bossProyectiles.set(proyectile4,proyHx4);
            this.bossProyectiles.set(proyectile5,proyHx5);
            new Tween({dc:0}).
            to({dc:1}, 750).
            onComplete(()=>{boss.bossShooting = false}).
            start();
        }
    }

    private destProy(where: Map<StateAnimations, Wall>, proyectile: StateAnimations, hitbox: Wall | undefined) {
        where.delete(proyectile);
        if (hitbox) {
            hitbox.destroy();
        }
        proyectile.destroy();
        
    }

    private addScore(points: number) {

        if (!this.bossSpawned) {
            const aux = parseFloat(this.scorepoints.text);
            this.scorepoints.text = (aux + points).toString();
        }

    }

    private respawnShip() {
        this.mySpaceship.position.set(-100, Manager.HEIGHT/2);
        new Tween(this.mySpaceship).
        to({x: 300}, 1500).
        start();
    }

    private spawnBoss() {

        this.boss = new XertacBoss();
        this.boss.position.set(Manager.WIDTH+200,Manager.HEIGHT/2);
        this.bossSpawned = true;
        this.addChild(this.boss);
        new Tween(this.boss).
        to({x: Manager.WIDTH-200}, 20000).
        onComplete(()=>{this.boss.activate()}).
        start();
        Manager.tweenVolume(0,15000);
        new Tween({dc:0}).
        to({dc:1}, 19500).
        onComplete(()=> {
            Manager.playMusic("BossBattle1");
        }).
        start();

    }

    private levelWon() {
        console.log("entre");
        new Tween({dc:0}).
        to({dc:1}, 11000).
        onComplete(()=> {
            const totalpoints = parseFloat(this.scorepoints.text);
            Manager.changeScene(new LevelWon(totalpoints));
        }).
        start();
    }

    private showMenu() {
        if (!this.onMenu) {
            this.onMenu = true;
            this.menuToggle.interactive = false;
            this.addChild(this.pauseMenu);
            new Tween(this.pauseMenu).
            to({scale: {x:0.75, y:0.75}},250).
            onComplete(()=>{Group.shared.pause()}).
            start();
        } else if (this.onMenu) {
            this.menuToggle.interactive = true;
            Group.shared.resume();
            new Tween(this.pauseMenu).
            to({scale: {x:0, y:0}},250)
            .onComplete(()=>{
                this.onMenu = false;
                this.removeChild(this.pauseMenu);
            })
            .start();
        }
    }

    private gameover() {
        new Tween({dc:0}).
        to({dc:1}, 1000).
        onComplete(()=>{
            const totalpoints = parseFloat(this.scorepoints.text);
            Manager.changeScene(new GameOver(totalpoints));
        }).
        start();
    }

    private muteMusic() {
        Manager.muteMusic();
    }
    private muteSFX() {
        Manager.muteSFX();
    }

}

enum LaserGlowFilterColor {
    one = 0x19F201,
    two = 0x48A5FA,
    three = 0xFF0000,
    four = 0xF77813,
    five = 0xFAF405,
    six = 0x7E19DF,
}