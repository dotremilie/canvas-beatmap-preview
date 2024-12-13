import {Circle} from "osu-standard-stable";
import {CIRCLE_BORDER_WIDTH} from "../renderers/OsuRenderer.ts";
import {Color4} from "osu-classes";
import {DrawableStandardHitObject} from "./DrawableStandardHitObject.ts";
import {DrawableApproachCircle} from "./DrawableApproachCircle.ts";

export class DrawableCircle extends DrawableStandardHitObject<Circle> {
    color: Color4;

    approachCircle: DrawableApproachCircle;

    constructor(hitObject: Circle, color: Color4) {
        super(hitObject);
        this.color = color;
        this.approachCircle = new DrawableApproachCircle(this);
    }

    draw(ctx: CanvasRenderingContext2D, time: number) {
        const {radius, stackedStartPosition, currentComboIndex} = this.hitObject;
        let {x, y} = stackedStartPosition;

        const scale = this.scale(time);
        const opacity = this.opacity(time);
        const circleSize = radius * (1 - CIRCLE_BORDER_WIDTH / 2) * scale;

        ctx.lineWidth = radius * CIRCLE_BORDER_WIDTH;
        ctx.strokeStyle = `rgba(255,255,255,${opacity})`;
        ctx.fillStyle = `rgba(${this.color.red},${this.color.green},${this.color.blue},${opacity})`;
        ctx.beginPath();
        ctx.arc(x, y, circleSize, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.font = `600 ${radius}px "Exo 2"`;
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.fillStyle = `rgba(255,255,255,${opacity})`;
        ctx.fillText((currentComboIndex + 1).toString(), x, y);
    }

    opacity(time: number): number {
        let opacity = super.opacity(time);

        if (time > this.hitObject.startTime) {
            opacity = 1 - (time - this.hitObject.startTime) / this.HIT_DURATION;
        }

        return opacity;
    }
}

