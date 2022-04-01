import { Application, Loader} from 'pixi.js'
import { assets } from './assets';
import { Scene } from './scenes/Scene';
import { Keyboard } from './Game/Utils/Keyboard';

const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x6df920,
	width: 1280,
	height: 720
});

Keyboard.initialize();

window.addEventListener("resize", ()=>{

	const scaleX = window.innerWidth / app.screen.width;
	const scaleY = window.innerHeight / app.screen.height;
	const scale = Math.min(scaleX, scaleY);

	const gameWidth = Math.round(app.screen.width * scale);
	const gameHeight = Math.round(app.screen.height * scale);

	const marginHorizontal = Math.floor((window.innerWidth - gameWidth) / 2);
	const marginVertical = Math.floor((window.innerHeight - gameHeight) / 2);

	app.view.style.width = gameWidth + "px";
	app.view.style.height = gameHeight + "px";

	app.view.style.marginLeft = marginHorizontal + "px";
	app.view.style.marginRight = marginHorizontal + "px";
	app.view.style.marginTop = marginVertical + "px";
	app.view.style.marginBottom = marginVertical + "px";

})

window.dispatchEvent(new Event("resize"));

Loader.shared.add(assets);

Loader.shared.onComplete.add(()=>{

	const myScene = new Scene();
	app.stage.addChild(myScene);

});

Loader.shared.load();
