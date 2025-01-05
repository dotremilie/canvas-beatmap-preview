import {HitObject, Ruleset, RulesetBeatmap} from "osu-classes";
import Renderer from "../renderers/Renderer.ts";
import DrawableHitObject from "../drawables/DrawableHitObject.ts";
import {BeatmapDecoder} from "osu-parsers";
import {PREVIEW_TIME_FROM_BEATMAP} from "../main.ts";

export default abstract class BeatmapPreviewer<TBeatmap extends RulesetBeatmap, TRenderer extends Renderer<RulesetBeatmap, DrawableHitObject<HitObject>>> {
    protected readonly canvas: HTMLCanvasElement;
    protected readonly ctx: CanvasRenderingContext2D;

    private decoder: BeatmapDecoder;
    private renderer!: TRenderer;

    private startTime: number = 0;
    private previewTime: number = 0;

    protected constructor(
        private id: string,
        private ruleset: Ruleset,
        private createRenderer: (ctx: CanvasRenderingContext2D, beatmap: TBeatmap) => TRenderer
    ) {
        this.canvas = document.createElement("canvas") as HTMLCanvasElement;
        this.canvas.setAttribute("id", this.id);
        document.body.appendChild(this.canvas);

        const ctx = this.canvas.getContext("2d");
        if (!ctx) {
            throw new Error("Canvas not supported");
        }

        this.ctx = ctx;
        this.canvas.width = 640;
        this.canvas.height = 480;
        this.ctx.scale(1, 1);

        this.startTime = performance.now();
        this.decoder = new BeatmapDecoder();
    }

    private animateBeatmap(totalLength: number) {
        const animateBeatmap = (currentTime: number) => {
            const time = (currentTime - this.startTime + this.previewTime);

            this.ctx.save();
            this.ctx.translate(64,48);
            this.renderer.render(time);
            this.ctx.restore();

            if (time > totalLength) {
                this.startTime = performance.now();
            }

            requestAnimationFrame(animateBeatmap);
        }

        requestAnimationFrame(animateBeatmap);
    }

    private clearScreen() {
        const clear = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            requestAnimationFrame(clear);
        }

        requestAnimationFrame(clear);
    }

    public async loadBeatmap(url: string, mods: number = 0) {
        const response = await fetch(url);
        const data = await response.text();

        const rawBeatmap = this.decoder.decodeFromString(data);
        const appliedMods = this.ruleset.createModCombination(mods);
        const appliedBeatmap = this.ruleset.applyToBeatmapWithMods(rawBeatmap, appliedMods) as TBeatmap;

        this.renderer = this.createRenderer(this.ctx, appliedBeatmap);
        this.previewTime = PREVIEW_TIME_FROM_BEATMAP ? appliedBeatmap.general.previewTime : 0;

        this.clearScreen();

        this.animateBeatmap(appliedBeatmap.totalLength);
    }
}
