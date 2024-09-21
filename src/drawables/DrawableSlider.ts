import {DrawableStandardHitObject} from "./DrawableStandardHitObject.ts";
import {Slider} from "osu-standard-stable";
import {Color4} from "osu-classes";
import {DrawableSliderBody} from "./DrawableSliderBody.ts";
import {DrawableSliderHead} from "./DrawableSliderHead.ts";
import {DrawableSliderBall} from "./DrawableSliderBall.ts";

export class DrawableSlider extends DrawableStandardHitObject<Slider> {
    color: Color4;

    sliderBody: DrawableSliderBody;
    sliderHead: DrawableSliderHead;
    sliderBall: DrawableSliderBall;
    //sliderRepeat: DrawableSliderRepeat;
    //sliderTail: DrawableSliderTail;

    constructor(hitObject: Slider, color: Color4) {
        super(hitObject);
        this.color = color;
        this.sliderBody = new DrawableSliderBody(hitObject, color);
        this.sliderHead = new DrawableSliderHead(hitObject, color);
        this.sliderBall = new DrawableSliderBall(this);
        //this.sliderRepeat = new DrawableSliderRepeat(hitObject, color);
        //this.sliderTail = new DrawableSliderTail(hitObject, color);
    }

    draw(ctx: CanvasRenderingContext2D, time: number) {
        this.sliderBody.draw(ctx, time);
        this.sliderBall.draw(ctx, time);
        this.sliderHead.draw(ctx, time);
    }

    opacity(time: number): number {
        let opacity = super.opacity(time);

        if (time > this.hitObject.endTime) {
            opacity = 1 - (time - this.hitObject.endTime) / this.HIT_DURATION;
        }

        return opacity;
    }
}

