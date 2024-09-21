import {StandardHitObject} from "osu-standard-stable";

/**
 * Abstract class representing a drawable hit object.
 *
 * @template T - The type of the hit object, extending StandardHitObject.
 */
export abstract class DrawableStandardHitObject<T extends StandardHitObject> {
    HIT_FACTOR = 1.33;
    HIT_DURATION = 150;

    hitObject: T;
    parentHitObject?: DrawableStandardHitObject<StandardHitObject>;

    /**
     * Creates a new drawable hit object.
     *
     * @param hitObject - The hit object to draw.
     */
    constructor(hitObject: T) {
        this.hitObject = hitObject;
    }

    /**
     * Calculates the opacity of the hit object at a given time.
     *
     * @param time - The current time in milliseconds.
     * @returns The opacity of the hit object.
     */
    opacity(time: number): number {
        return Math.max(0, time - (this.hitObject.startTime - this.hitObject.timePreempt)) / this.hitObject.timeFadeIn;
    };

    /**
     * Calculates the scale of the hit object at a given time.
     *
     * @param time - The current time in milliseconds.
     * @returns The scale factor of the hit object.
     */
    scale(time: number): number {
        if (time <= this.hitObject.startTime) return 1;

        const t = (time - this.hitObject.startTime) / this.HIT_DURATION;
        return 1 - t + t * this.HIT_FACTOR;
    };

    /**
     * Draws the hit object on the canvas.
     *
     * @param ctx - The canvas rendering context.
     * @param time - The current time in milliseconds.
     */
    abstract draw(ctx: CanvasRenderingContext2D, time: number): void;
}
