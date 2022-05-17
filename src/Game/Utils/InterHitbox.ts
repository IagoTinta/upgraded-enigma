import { Rectangle } from "pixi.js";


export interface InterHitbox {

    getHitbox():Rectangle;

}

export function checkCollision(objectA:InterHitbox, objectB:InterHitbox):Rectangle | null {

    const rectA = objectA.getHitbox();
    const rectB = objectB.getHitbox();

    const rightmostLeft = rectA.left < rectB.left ? rectB.left : rectA.left;
    const leftmostRight = rectA.right > rectB.right ? rectB.right : rectA.right;
    const bottommostTop = rectA.top < rectB.top ? rectB.top : rectA.top;
    const topmostBottom = rectA.bottom > rectB.bottom ? rectB.bottom : rectA.bottom;

    //"makes sense" es que la izquierda es la izquierda y la derecha es la derecha
    const makesSenseHorizontal = rightmostLeft < leftmostRight;
    const makesSenseVertical = bottommostTop < topmostBottom;

    if (makesSenseHorizontal && makesSenseVertical) {
        const retval = new Rectangle();
        retval.x = rightmostLeft;
        retval.y = bottommostTop;
        retval.width = leftmostRight - rightmostLeft;
        retval.height = topmostBottom - bottommostTop;
        return retval;
    } else {
        return null;
    }

}