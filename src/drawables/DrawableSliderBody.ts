import {Slider} from "osu-standard-stable";
import {CIRCLE_BORDER_WIDTH} from "../renderers/OsuRenderer.ts";
import {Color4} from "osu-classes";
import {DrawableStandardHitObject} from "./DrawableStandardHitObject.ts";

// TODO: Separate SliderPath into its own class
export class DrawableSliderBody extends DrawableStandardHitObject<Slider> {
    color: Color4;

    constructor(hitObject: Slider, color: Color4) {
        super(hitObject);
        this.color = color;
    }

    draw(ctx: CanvasRenderingContext2D, time: number) {
        const {radius, path, stackedStartPosition} = this.hitObject;
        const {x, y} = stackedStartPosition;

        const opacity = this.opacity(time);

        ctx.beginPath();
        ctx.moveTo(x, y);

        for (let i = 0; i < path.path.length; i++) {
            ctx.lineTo(x + path.path[i].x, y + path.path[i].y);
        }

        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = radius * 2;
        ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
        ctx.stroke();
        ctx.lineWidth = radius * 2 * (1 - CIRCLE_BORDER_WIDTH);
        ctx.strokeStyle = `rgba(${this.color.red},${this.color.green},${this.color.blue},${opacity})`;
        ctx.stroke();
    }

    opacity(time: number): number {
        let opacity = super.opacity(time);

        if (time > this.hitObject.endTime) {
            opacity = 1 - (time - this.hitObject.endTime) / this.HIT_DURATION;
        }

        return opacity;
    }
}

