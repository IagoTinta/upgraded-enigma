import { Container, Texture, TilingSprite } from "pixi.js";
import { Tween } from "tweedle.js";
import { HEIGHT, WIDTH } from "..";
import { EnemyShip } from "../Game/Npcs/EnemyShip";
import { Spaceship } from "../Game/Npcs/Spaceship";
import { checkCollision } from "../Game/Utils/InterHitbox";
import { InterUpdateable } from "../Game/Utils/InterUpdateable";
import { Keyboard } from "../Game/Utils/Keyboard";
import { StateAnimations } from "../Game/Utils/StateAnimations";
import { PowerUp } from "../Game/WorldObjects/PowerUp";
import { Wall } from "../Game/WorldObjects/Wall";


export class Level extends Container implements InterUpdateable {

    private world: Container;
    private background: TilingSprite;
    private mySpaceship: Spaceship;
    private enemy: EnemyShip;
    private powerup: PowerUp;
    private walls: Wall[];
    private proyectiles: Map<StateAnimations,Wall> = new Map();
    private PUactive: boolean = false;

    constructor() {

        super();
        this.world = new Container;
        this.background = new TilingSprite(Texture.from("background"), WIDTH, HEIGHT);
        this.mySpaceship = new Spaceship();
        this.mySpaceship.position.set(WIDTH/4,HEIGHT/2);

        this.enemy = new EnemyShip();
        this.enemy.position.set(WIDTH * (3/4), HEIGHT/2);

        this.walls = [];
        const leftWall = new Wall(20,HEIGHT);
        const rightWall = new Wall(20,HEIGHT);
        rightWall.position.x = WIDTH-20;
        const topWall = new Wall(WIDTH,10);
        const bottomWall = new Wall(WIDTH,10);
        bottomWall.position.y = HEIGHT-10;
        this.walls.push(leftWall, rightWall, topWall, bottomWall);

        this.powerup = new PowerUp();

        this.world.addChild(this.mySpaceship, this.enemy);
        this.addChild(
            this.background, 
            this.world,
            leftWall,
            rightWall,
            topWall,
            bottomWall
        );

        Keyboard.down.on("Space", this.shootFrom, this);

    }

    public update (deltaTime: number, _deltaFrame: number):void {

        this.mySpaceship.update(deltaTime);
        this.powerup.updateAnim(deltaTime);
        this.world.x -= 0.1 * this.worldTransform.a;
        this.background.tilePosition.x = this.world.x * 10;

        for (let wall of this.walls) {
            const limit = checkCollision(this.mySpaceship,wall);
            if (limit != null) {
                this.mySpaceship.separate(limit,wall.position);
                this.mySpaceship.speed.set(0,0);
            }
            const enemyLimit = checkCollision(this.enemy, wall);
            if (enemyLimit != null) {
                this.enemy.changeSpeed();
            }
        }
        for (let proy of this.proyectiles.keys()) {
            proy.updateAnim(deltaTime);
            const hx = this.proyectiles.get(proy);
            proy.x += 30;
            if (hx) {
                hx.position.copyFrom(proy);
                const hitEnemy = checkCollision(hx,this.enemy);
                if (hitEnemy != null) {
                    proy.playState("hit");
                    proy.x -= 30;
                    this.enemy.receiveDamage(this.mySpaceship.dealDamage());
                    new Tween({dc:0}).
                    to({dc:1},1).
                    onComplete(()=>{this.destProy(proy,hx)}).
                    start();
                }
                const hitPU = checkCollision(hx,this.powerup);
                if (hitPU != null && !this.powerup.pickeable) {
                    proy.playState("hit");
                    proy.x -= 30;
                    this.powerup.explode();
                    new Tween({dc:0}).
                    to({dc:1},1).
                    onComplete(()=>{this.destProy(proy,hx)}).
                    start();
                }
            }
            if (proy.x > WIDTH+(-this.world.x)) {
                this.destProy(proy,hx);
            }
        }
        if (this.enemy.isDead()) {
            new Tween({dc:0}).
            to({dc:1},350).
            onStart(()=>{this.enemy.explode()}).
            onComplete(()=>{this.world.removeChild(this.enemy)}).
            start();
        } else {
            this.enemy.update(deltaTime);
            this.enemy.x += 0.1 * this.worldTransform.a;
        }

        if (!this.PUactive) {
            this.PUactive = true;
            const timer = new Tween({dc:1}).
            to({dc:1}, 90000).
            onStart(()=>{
                this.powerup.position.set(WIDTH+100,Math.random()*500+100);
                this.powerup.respawn();
                this.addChild(this.powerup);
            }).
            onUpdate(()=>{
                this.powerup.x--;
                const picked = checkCollision(this.mySpaceship, this.powerup);
                if (picked != null && this.powerup.pickeable) {
                    this.removeChild(this.powerup);
                    this.powerup.pickeable = false;
                }
            }).
            onComplete(()=>{
                timer.restart();
                this.PUactive = false;
            }).
            start();
        }

    }

    public shootFrom() {
        if (!this.mySpaceship.isShooting() && !this.mySpaceship.isDead()) {
            this.mySpaceship.shoot();
            const proyectile = new StateAnimations();
            proyectile.addState("shoted",["proyectile3.png"], 0.5);
            proyectile.playState("shoted");
            proyectile.position.set(this.mySpaceship.x+60, this.mySpaceship.y+5);
            const proyHx = new Wall(15,15);
            proyHx.position.copyFrom(proyectile);
            this.world.addChild(proyectile,proyHx);
            this.proyectiles.set(proyectile,proyHx);
        }
    }

    private destProy(proyectile: StateAnimations, hitbox: Wall | undefined) {
        this.proyectiles.delete(proyectile);
        proyectile.destroy();
        if (hitbox) {
            hitbox.destroy();
        }
    }

}

/*
this.pauseMenu = new Container();

        const pauseBoard = new NineSlicePlane(Texture.from("Board"),35,35,35,35);
        const pauseBoardtittle = new NineSlicePlane(Texture.from("Tittle"),35,35,35,35);
        const pauseTittle: Text = new Text("Pause", TEXT_STYLE);
        this.pauseMenu.addChild(pauseBoard,pauseBoardtittle,pauseTittle);
        pauseBoardtittle.position.set(166,-50);
        pauseTittle.anchor.set(0.5);
        pauseTittle.position.set(522.5,15);
        this.pauseMenu.scale.set(0);
        this.pauseMenu.pivot.set(522.5,358);
        this.pauseMenu.position.set(WIDTH/2,HEIGHT/2);

        const resume = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        resume.position.set(272.5,250);
        const resumeText: Text = new Text("Resume", TEXT_STYLE);
        resumeText.anchor.set(0.5);
        resumeText.position.copyFrom(resume);
        resume.on(Button.CLICKED_EVENT,this.showMenu,this);
        const muteMusic = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        muteMusic.position.set(772.5,250);
        const muteMusicText: Text = new Text("Mute Music", TEXT_STYLE);
        muteMusicText.anchor.set(0.5);
        muteMusicText.position.copyFrom(muteMusic);
        muteMusic.on(Button.CLICKED_EVENT,this.muteMusic,this);
        const back2Menu = new Button(Texture.from("normal"),Texture.from("down"),Texture.from("over"));
        back2Menu.position.set(522.5,500);
        const b2mText: Text = new Text("Back to Main Menu", TEXT_STYLE);
        b2mText.anchor.set(0.5);
        b2mText.position.copyFrom(back2Menu);
        back2Menu.on(Button.CLICKED_EVENT,this.mainMenu,this);
        this.pauseMenu.addChild(resume,resumeText,muteMusic,muteMusicText,back2Menu,b2mText);
    
        Keyboard.down.on("Escape",this.showMenu,this);
      
    }

    showMenu() {
        if (!this.onMenu) {
            this.onMenu = true;
            this.addChild(this.pauseMenu);
            new Tween(this.pauseMenu).to({scale: {x:0.75, y:0.75}},250).start();
        } else if (this.onMenu) {
            new Tween(this.pauseMenu).to({scale: {x:0, y:0}},250)
            .onComplete(()=>{
                this.onMenu = false;
                this.removeChild(this.pauseMenu);
            })
            .start();
        }
    }
    private muteMusic() {
        if (!this.music.muted) {
            this.music.muted = true;
        } else {
            this.music.muted = false;
        }
    }
    private mainMenu() {
        this.music.muted = true;
        const newscene = new MainMenu();
        changeScene(newscene);
    }
*/