import {HitObject, Ruleset, RulesetBeatmap} from "osu-classes";
import Renderer from "../renderers/Renderer.ts";
import DrawableHitObject from "../drawables/DrawableHitObject.ts";
import {BeatmapDecoder} from "osu-parsers";
import {PREVIEW_TIME_FROM_BEATMAP} from "../main.ts";

export default abstract class BeatmapPreviewer<TBeatmap extends RulesetBeatmap, TRenderer extends Renderer<RulesetBeatmap, DrawableHitObject<HitObject>>> {
    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;

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

    private animate(totalLength: number) {
        const animate = (currentTime: number) => {
            const time = (currentTime - this.startTime + this.previewTime);

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.renderer.render(time);

            if (time > totalLength) {
                this.startTime = performance.now();
            }

            requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
    }

    public async loadBeatmap(url: string) {
        const response = await fetch(url);
        const data = await response.text();

        const rawBeatmap = this.decoder.decodeFromString(data);
        const appliedBeatmap = this.ruleset.applyToBeatmap(rawBeatmap) as TBeatmap;

        this.renderer = this.createRenderer(this.ctx, appliedBeatmap);
        this.previewTime = PREVIEW_TIME_FROM_BEATMAP ? appliedBeatmap.general.previewTime : 0;

        this.animate(appliedBeatmap.totalLength);
    }
}
