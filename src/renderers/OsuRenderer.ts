import {Circle, Slider, Spinner, StandardBeatmap, StandardHitObject} from "osu-standard-stable";
import {Color4} from "osu-classes";
import {DrawableSpinner} from "../drawables/DrawableSpinner.ts";
import {DrawableCircle} from "../drawables/DrawableCircle.ts";
import {DrawableStandardHitObject} from "../drawables/DrawableStandardHitObject.ts";
import {DrawableSlider} from "../drawables/DrawableSlider.ts";

export const CIRCLE_BORDER_WIDTH = 0.15;
export const DEFAULT_COLORS = [
    new Color4(0, 202, 0),
    new Color4(18, 124, 255),
    new Color4(242, 24, 57),
    new Color4(255, 192, 0),
];

export default class OsuRenderer {
    ctx: CanvasRenderingContext2D;
    beatmap: StandardBeatmap;

    drawableHitObjects: DrawableStandardHitObject<StandardHitObject>[] = [];

    constructor(ctx: CanvasRenderingContext2D, beatmap: StandardBeatmap) {
        this.ctx = ctx;
        this.beatmap = beatmap;

        if (this.beatmap.colors.comboColors.length === 0) {
            this.beatmap.colors.comboColors = DEFAULT_COLORS;
        }

        this.beatmap.hitObjects.forEach((object) => {
            const currentComboColorIndex = object.comboIndexWithOffsets % this.beatmap.colors.comboColors.length;
            const color = this.beatmap.colors.comboColors[currentComboColorIndex];

            if (object instanceof Spinner) {
                this.drawableHitObjects.push(new DrawableSpinner(object));
            } else if (object instanceof Slider) {
                this.drawableHitObjects.push(new DrawableSlider(object, color));
            } else if (object instanceof Circle) {
                this.drawableHitObjects.push(new DrawableCircle(object, color));
            }
        })
    }

    render(time: number) {
        let hitObjects = this.drawableHitObjects.filter(object => {
            if (time < object.hitObject.startTime - object.hitObject.timePreempt) return false;

            if (object instanceof DrawableSlider || object instanceof DrawableSpinner) {
                if (time > object.hitObject.endTime + object.HIT_DURATION) return false;
            } else {
                if (time > object.hitObject.startTime + object.HIT_DURATION) return false;
            }

            return true;
        }).reverse();

        hitObjects.forEach((object) => {
            object.draw(this.ctx, time);
        });

        hitObjects.forEach((object) => {
            if (object instanceof DrawableSlider) {
                object.sliderHead.approachCircle.draw(this.ctx, time);
            }

            if (object instanceof DrawableCircle) {
                object.approachCircle.draw(this.ctx, time);
            }
        });
    }
}
