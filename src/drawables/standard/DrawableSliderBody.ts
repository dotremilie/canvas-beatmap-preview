import {Slider} from "osu-standard-stable";
import {Color4} from "osu-classes";
import {DrawableStandardHitObject} from "./DrawableStandardHitObject.ts";
import {CIRCLE_BORDER_WIDTH} from "../../renderers/StandardRenderer.ts";

// TODO: Separate SliderPath into its own class
export class DrawableSliderBody extends DrawableStandardHitObject<Slider> {
    accentColor: Color4;
    borderColor: Color4;

    constructor(hitObject: Slider, accentColor: Color4 = new Color4(255, 255, 255), borderColor: Color4 = new Color4(255, 255, 255)) {
        super(hitObject);
        this.accentColor = accentColor;
        this.borderColor = borderColor;
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
        ctx.strokeStyle = `rgba(${this.borderColor.red},${this.borderColor.green},${this.borderColor.blue},${opacity})`;
        ctx.stroke();
        ctx.lineWidth = radius * 2 * (1 - CIRCLE_BORDER_WIDTH);
        ctx.strokeStyle = `rgba(${this.accentColor.red},${this.accentColor.green},${this.accentColor.blue},${opacity})`;
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

