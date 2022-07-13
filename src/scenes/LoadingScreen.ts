import { WebfontLoaderPlugin } from "pixi-webfont-loader";
import { Container, Graphics, Loader } from "pixi.js";
import { assets } from "../assets";
import { BaseScene } from "../Game/Utils/BaseScene";
import { Manager } from "../Game/Utils/Manager";
import { MainMenu } from "./MainMenu";


export class LoadingScreen extends BaseScene {
    
    private loadingBar: Container;
    private bar: Graphics;
    private fill: Graphics;

    constructor() {
        super();
        
        this.loadingBar = new Container();
        this.bar = new Graphics();
        this.bar.beginFill(0xFFFFFF,1);
        this.bar.drawRect(0,0,Manager.WIDTH-100,50);
        this.bar.endFill();
        this.fill = new Graphics();
        this.fill.beginFill(0xFF0000,1);
        this.fill.drawRect(12.5,12.5,this.bar.width-25,this.bar.height-25);
        this.fill.endFill();
        this.loadingBar.addChild(this.bar,this.fill);
        this.loadingBar.pivot.set(this.loadingBar.width/2,this.loadingBar.height/2);
        this.loadingBar.position.set(Manager.WIDTH/2,Manager.HEIGHT/2);

        this.addChild(this.loadingBar);

        this.percent(0);

        this.loadGame();
        
    }

    private loadGame() {
        
        Loader.registerPlugin(WebfontLoaderPlugin);
        Loader.shared.add(assets);
        Loader.shared.onProgress.add((loader)=>{this.percent(loader.progress)});
        Loader.shared.onComplete.once(this.loadFinish.bind(this));
        Loader.shared.load();
    }
    
    public update(_deltaFrame: number, _deltaTime?: number | undefined): void {
        
    }

    public percent(percent: number) {

        const factor = percent/100;

        this.fill.clear();
        this.fill.beginFill(0xFF0000,1);
        this.fill.drawRect(12.5,12.5,(this.bar.width-25) * factor,this.bar.height-25);
        this.fill.endFill();    
            
    }

    private loadFinish() {

        Manager.changeScene(new MainMenu());

    }
    
}