import {HitObject, Ruleset, RulesetBeatmap} from "osu-classes";
import Renderer from "../renderers/Renderer.ts";
import DrawableHitObject from "../drawables/DrawableHitObject.ts";
import {BeatmapDecoder} from "osu-parsers";

export const PREVIEW_TIME_FROM_BEATMAP = false;

export default abstract class BeatmapPreviewer<TBeatmap extends RulesetBeatmap, TRenderer extends Renderer<TBeatmap, DrawableHitObject<HitObject>>> {
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
        this.canvas = document.querySelector(`#${id}`) as HTMLCanvasElement;

        if (!this.canvas) {
            this.canvas = document.createElement("canvas") as HTMLCanvasElement;
            this.canvas.setAttribute("id", this.id);
            document.body.appendChild(this.canvas);
        }

        if (!(this.canvas instanceof HTMLCanvasElement)) {
            throw new Error("Queried element is not a HTMLCanvasElement");
        }

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

    public get getBeatmap() {
        return this.renderer?.getBeatmap;
    }

    public async loadBeatmapFromUrl(url: string, mods: number = 0) {
        const response = await fetch(url, {mode: "no-cors"});
        const data = await response.text();

        const rawBeatmap = this.decoder.decodeFromString(data);
        const appliedMods = this.ruleset.createModCombination(mods);
        const appliedBeatmap = this.ruleset.applyToBeatmapWithMods(rawBeatmap, appliedMods) as TBeatmap;

        this.renderer = this.createRenderer(this.ctx, appliedBeatmap);
        this.previewTime = PREVIEW_TIME_FROM_BEATMAP ? appliedBeatmap.general.previewTime : 0;
    }

    public async loadBeatmap(beatmap: TBeatmap, mods: number = 0) {
        const appliedMods = this.ruleset.createModCombination(mods);
        const appliedBeatmap = this.ruleset.applyToBeatmapWithMods(beatmap, appliedMods) as TBeatmap;

        this.renderer = this.createRenderer(this.ctx, appliedBeatmap);
        this.previewTime = PREVIEW_TIME_FROM_BEATMAP ? appliedBeatmap.general.previewTime : 0;
    }

    public updateFrame(time: number) {
        time = (time - this.startTime + this.previewTime);

        this.clearScreen();

        this.ctx.save();
        this.ctx.translate(64, 48);
        this.renderer.render(time);
        this.ctx.restore();
    }

    private clearScreen() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
