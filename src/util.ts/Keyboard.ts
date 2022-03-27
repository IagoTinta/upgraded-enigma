import { utils } from "pixi.js";


export class Keyboard {

    public static readonly state: Map<string,boolean> = new Map();

    public static readonly down: utils.EventEmitter = new utils.EventEmitter();
    public static readonly up: utils.EventEmitter = new utils.EventEmitter();
    
    private constructor(){};

    public static initialized:boolean = false;

    public static initialize():void{

        if (Keyboard.initialized==true) {
            return;
        }
        Keyboard.initialized = true;
        document.addEventListener("keydown",Keyboard.onKeyDown);
        document.addEventListener("keyup",Keyboard.onKeyUp);

    }

    private static onKeyDown(event:KeyboardEvent){

        if (Keyboard.state.get(event.code)!=true) {
            Keyboard.down.emit(event.code);
        }
        Keyboard.state.set(event.code,true);

    }
    private static onKeyUp(event:KeyboardEvent){

        Keyboard.up.emit(event.code);
        Keyboard.state.set(event.code,false);

    }

}