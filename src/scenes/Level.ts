import { Container, Texture, TilingSprite } from "pixi.js";
import { Tween } from "tweedle.js";
import { EnemyShip } from "../Game/Npcs/EnemyShip";
import { Spaceship } from "../Game/Npcs/Spaceship";
import { BaseScene } from "../Game/Utils/BaseScene";
import { checkCollision } from "../Game/Utils/InterHitbox";
import { Keyboard } from "../Game/Utils/Keyboard";
import { Manager } from "../Game/Utils/Manager";
import { StateAnimations } from "../Game/Utils/StateAnimations";
import { PowerUp } from "../Game/WorldObjects/PowerUp";
import { Wall } from "../Game/WorldObjects/Wall";
import { GlowFilter } from "@pixi/filter-glow";


export class Level extends BaseScene {

    private world: Container;
    private background: TilingSprite;
    private mySpaceship: Spaceship;
    private enemies: EnemyShip[];
    private powerup: PowerUp;
    private walls: Wall[];
    private proyectiles: Map<StateAnimations,Wall> = new Map();
    private enemyProyectiles: Map<StateAnimations,Wall> = new Map();
    private PUactive: boolean = false;
    private laserGlow: GlowFilter;

    constructor() {

        super();
        this.world = new Container;
        this.background = new TilingSprite(Texture.from("background"), Manager.WIDTH, Manager.HEIGHT);
        this.mySpaceship = new Spaceship();
        this.mySpaceship.position.set(Manager.WIDTH/4,Manager.HEIGHT/2);

        
        this.walls = [];
        const leftWall = new Wall(20,Manager.HEIGHT);
        const rightWall = new Wall(20,Manager.HEIGHT);
        rightWall.position.x = Manager.WIDTH-20;
        const topWall = new Wall(Manager.WIDTH,10);
        const bottomWall = new Wall(Manager.WIDTH,10);
        bottomWall.position.y = Manager.HEIGHT-10;
        this.walls.push(leftWall, rightWall, topWall, bottomWall);
        
        this.powerup = new PowerUp();
        this.laserGlow = new GlowFilter({color: 0xFF0000});
        
        this.addChild(
            this.background, 
            this.world,
            this.mySpaceship,
        );

        this.enemies = [];
        for (let i = 0; i<5; i++) {
            const newEnemy = new EnemyShip();
            this.respawnEnemy(newEnemy);
            this.enemies.push(newEnemy);
            this.addChild(newEnemy);
        }

        this.addChild(
            leftWall,
            rightWall,
            topWall,
            bottomWall
        )
            
        Keyboard.down.on("Space", this.shoot, this);
            
    }

    public override destroy(options:any) {
        super.destroy(options);
        Keyboard.down.off("Space", this.shoot);
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
        }
        for (let proy of this.proyectiles.keys()) {
            proy.updateAnim(deltaTime);
            const hx = this.proyectiles.get(proy);
            proy.x += 30;
            if (hx) {
                hx.position.copyFrom(proy);
                for (let enemy of this.enemies) {
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
                const hitPU = checkCollision(hx,this.powerup);
                if (hitPU != null && !this.powerup.pickeable) {
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
        for (let eproy of this.enemyProyectiles.keys()) {
            eproy.updateAnim(deltaTime);
            const ehx = this.enemyProyectiles.get(eproy);
            eproy.x -= 3.5;
            if (ehx) {
                ehx.position.copyFrom(eproy);
                const hit = checkCollision(ehx,this.mySpaceship);
                if (hit != null) {
                    eproy.playState("landed");
                    eproy.x += 5;
                    this.mySpaceship.explode();
                    new Tween({dc:0}).
                    to({dc:1},1).
                    onComplete(()=>{this.destProy(this.enemyProyectiles,eproy,ehx)}).
                    start();
                }
            }
            if (eproy.x < -100) {
                this.destProy(this.enemyProyectiles,eproy,ehx);
            }
        }

        for (let enemy of this.enemies) {
            if (enemy.enemyDead) {
                this.removeChild(enemy);
                new Tween({dc:0}).
                to({dc:1}, 2000).
                onComplete(()=>{this.respawnEnemy(enemy)}).
                start();
            } else {
                enemy.update(deltaTime);
                this.enemyShoot(enemy)
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

    }

    public respawnEnemy(enemy: EnemyShip) {
        enemy.respawn();
        enemy.position.set(Manager.WIDTH+100, Math.random()*(Manager.HEIGHT+600)-300);
        if (enemy.position.y < Manager.HEIGHT/4) {
            enemy.speed.y = 50;
        }
        if (enemy.position.y > (Manager.HEIGHT * (3/4))) {
            enemy.speed.y = -50;
        }
        this.addChild(enemy);
    }

    public shoot() {
        if (!this.mySpaceship.isShooting() && !this.mySpaceship.isDead()) {
            this.mySpaceship.shoot();
            const proyectile = new StateAnimations();
            proyectile.addState("shoted",["proyectile3.png"], 0.5);
            proyectile.addState("landed", [
                "shot3_exp1.png",
                "shot3_exp2.png",
                "shot3_exp3.png",
                "shot3_exp4.png"
            ], 0.5, false);
            proyectile.playState("shoted");
            proyectile.position.set(this.mySpaceship.x+40, this.mySpaceship.y+5);
            proyectile.filters = [this.laserGlow]
            const proyHx = new Wall(15,15);
            proyHx.position.copyFrom(proyectile);
            this.addChild(proyectile,proyHx);
            this.proyectiles.set(proyectile,proyHx);
        }
    }

    private enemyShoot(enemy: EnemyShip) {
        if (!enemy.shooting) {
            enemy.shooting = true;
            const proyectile = new StateAnimations();
            proyectile.addState("shoted",["proyectile3.png"], 0.5);
            proyectile.addState("landed", [
                "shot3_exp1.png",
                "shot3_exp2.png",
                "shot3_exp3.png",
                "shot3_exp4.png"
            ], 0.5, false);
            proyectile.playState("shoted");
            proyectile.position.set(enemy.x-100, enemy.y);
            const proyHx = new Wall(15,15);
            proyHx.position.copyFrom(proyectile);
            this.addChild(proyectile,proyHx);
            this.enemyProyectiles.set(proyectile,proyHx);
            new Tween({dc:0}).
            to({dc:1}, 1500).
            onComplete(()=>{enemy.shooting = false}).
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

    

}

/*

this.music = sound.find("algo");
        this.music.play({volume:0.2,singleInstance:true,loop:true});
        this.music.muted = false;

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