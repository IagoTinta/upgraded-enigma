import { Application, Loader, Sprite } from 'pixi.js'

const app = new Application({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 1,
	autoDensity: true,
	backgroundColor: 0x6495ed,
	width: 640,
	height: 480
});

window.addEventListener("resize", ()=>{

	console.log("resized!");
	app.screen.width
	app.screen.height

})

Loader.shared.add({url:"./Trifuerza.png", name:"myTriforce"});

Loader.shared.onComplete.add(()=>{

	const clampy: Sprite = Sprite.from("myTriforce");
	
	clampy.anchor.set(0);
	
	clampy.x = 0;
	clampy.y = 0;
	
	app.stage.addChild(clampy);

});

Loader.shared.load();
