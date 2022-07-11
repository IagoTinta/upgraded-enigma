import { Container } from "pixi.js";


export abstract class BaseScene extends Container {
    
    public abstract update(deltaFrame: number, deltaTime?: number): void;

}