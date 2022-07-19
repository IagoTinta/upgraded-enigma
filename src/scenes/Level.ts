import { Container, Texture, TilingSprite } from "pixi.js";
import { Tween } from "tweedle.js";
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
import { sound, Sound } from "@pixi/sound";
import { SmallEnemy } from "../Game/Npcs/SmallEnemy";
import { MediumEnemy } from "../Game/Npcs/MediumEnemy";


export class Level extends BaseScene {

    //world
    private world: Container;
    private background: TilingSprite;
    private walls: Wall[];
    private powerup: PowerUp;

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

    //sound and effects
    private laserGlow: GlowFilter;
    private levelMusic: Sound;
    private SFX: Map<string,Sound> = new Map();

    //miscellaneous
    private PUactive: boolean = false;

    constructor(musicMuted: boolean, SFXMuted: boolean) {

        super();

        this.levelMusic = sound.find("Level1Music");
        this.levelMusic.play({volume: 0.2, singleInstance: true, loop: true});
        this.levelMusic.muted = musicMuted;

        this.SFX.set("SsShooting", sound.find("SsLaser"));
        this.SFX.forEach((key)=>key.muted = SFXMuted);

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

        this.bigEnemies = [];
        for (let i = 0; i<3; i++) {
            const newBE = new BigEnemy();
            this.respawnEnemy(newBE);
            this.bigEnemies.push(newBE);
            this.addChild(newBE);
        }
        this.mediumEnemies = [];
        for (let i = 0; i<6; i++) {
            const newME = new MediumEnemy();
            this.respawnEnemy(newME);
            this.mediumEnemies.push(newME);
            this.addChild(newME);
        }
        this.smallEnemies = [];
        for (let i = 0; i<10; i++) {
            const newSE = new SmallEnemy();
            this.respawnEnemy(newSE);
            this.smallEnemies.push(newSE);
            this.addChild(newSE);
        }

        this.addChild(
            leftWall,
            rightWall,
            topWall,
            bottomWall
        );
        
            
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
            if (limit != null && !this.mySpaceship.isDead()) {
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
                new Tween({dc:0}).
                to({dc:1}, 2000).
                onComplete(()=>{this.respawnEnemy(enemy)}).
                start();
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
                new Tween({dc:0}).
                to({dc:1}, 2000).
                onComplete(()=>{this.respawnEnemy(enemy)}).
                start();
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
                new Tween({dc:0}).
                to({dc:1}, 2000).
                onComplete(()=>{this.respawnEnemy(enemy)}).
                start();
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

    public respawnEnemy(enemy: BigEnemy | SmallEnemy | MediumEnemy) {
        enemy.respawn();
        enemy.position.set(Manager.WIDTH+(Math.random()*200)+50, Math.random()*(Manager.HEIGHT+600)-300);
        if (enemy instanceof BigEnemy) {
            if (enemy.position.y < Manager.HEIGHT/4) {
                enemy.speed.y = 35;
            }
            if (enemy.position.y > (Manager.HEIGHT * (3/4))) {
                enemy.speed.y = -35;
            }
        }
        if (enemy instanceof MediumEnemy) {
            if (enemy.position.y < Manager.HEIGHT/4) {
                enemy.speed.y = 50;
            }
            if (enemy.position.y > (Manager.HEIGHT * (3/4))) {
                enemy.speed.y = -50;
            }
        }
        if (enemy instanceof SmallEnemy) {
            if (enemy.position.y < Manager.HEIGHT/4) {
                enemy.speed.y = 90;
            }
            if (enemy.position.y > (Manager.HEIGHT * (3/4))) {
                enemy.speed.y = -90;
            }
        }
        this.addChild(enemy);
    }

    public shoot() {
        if (!this.mySpaceship.isShooting() && !this.mySpaceship.isDead()) {
            this.SFX.get("SsShooting")?.play({volume: 0.2, singleInstance: true});
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
            proyectile.filters = [this.laserGlow];
            const proyHx = new Wall(15,15);
            proyHx.position.copyFrom(proyectile);
            this.addChild(proyectile,proyHx);
            this.proyectiles.set(proyectile,proyHx);
        }
    }

    private bigEnemyShoot(enemy: BigEnemy) {
        if (!enemy.bigShooting) {
            enemy.bigShooting = true;
            const proyectile = new StateAnimations();
            proyectile.addState("shoted",["proyectile3.png"], 0.5);
            proyectile.addState("landed", [
                "shot3_exp1.png",
                "shot3_exp2.png",
                "shot3_exp3.png",
                "shot3_exp4.png"
            ], 0.5, false);
            proyectile.playState("shoted");
            proyectile.position.set(enemy.x, enemy.y);
            const proyHx = new Wall(15,15);
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
            proyectile.addState("shoted",["proyectile3.png"], 0.5);
            proyectile.addState("landed", [
                "shot3_exp1.png",
                "shot3_exp2.png",
                "shot3_exp3.png",
                "shot3_exp4.png"
            ], 0.5, false);
            proyectile.playState("shoted");
            proyectile.position.set(enemy.x, enemy.y);
            const proyHx = new Wall(15,15);
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
            proyectile.addState("shoted",["proyectile3.png"], 0.5);
            proyectile.addState("landed", [
                "shot3_exp1.png",
                "shot3_exp2.png",
                "shot3_exp3.png",
                "shot3_exp4.png"
            ], 0.5, false);
            proyectile.playState("shoted");
            proyectile.position.set(enemy.x, enemy.y);
            const proyHx = new Wall(15,15);
            proyHx.position.copyFrom(proyectile);
            this.addChild(proyectile,proyHx);
            this.smallEnemyProyectiles.set(proyectile,proyHx);
            new Tween({dc:0}).
            to({dc:1}, 2000).
            onComplete(()=>{enemy.smallShooting = false}).
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