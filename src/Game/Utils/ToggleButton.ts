import { Container, Texture } from "pixi.js";
import { Button } from "./Button";


export class ToggleButton extends Container {
    
    public static readonly TOGGLE_EVENT:string = "toggledButtonEvent";
    private toggledOn:Button;
    private toggledOff:Button;
    private state:boolean = true;
    
    constructor(toggledOnDef:Texture,toggledOnDown:Texture,toggledOnOver:Texture,
        toggledOffDef:Texture,toggledOffDown:Texture,toggledOffOver:Texture,) {

        super();
        this.toggledOn = new Button(toggledOnDef,toggledOnDown,toggledOnOver);
        this.toggledOff = new Button(toggledOffDef,toggledOffDown,toggledOffOver);
        this.toggledOn.on("buttonClick",this.toggle, this);
        this.toggledOff.on("buttonClick",this.toggle, this);
        this.addChild(this.toggledOn,this.toggledOff);

    }
    public getState() : boolean {
        return this.state;
    }

    public setState(value: boolean) {
        this.state = value;
        this.fixState();
    }

    public toggle() {
        this.state = !this.state;
        this.emit(ToggleButton.TOGGLE_EVENT, this.state);
    }
    
    private fixState() {
        if (this.state) {
            this.toggledOff.visible = false;
            this.toggledOn.visible = true;
        }
        else {
            this.toggledOff.visible = true;
            this.toggledOn.visible = false;
        }
    }

}