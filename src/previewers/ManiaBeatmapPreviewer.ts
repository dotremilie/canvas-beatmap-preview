import BeatmapPreviewer from "./BeatmapPreviewer.ts";
import {ManiaBeatmap, ManiaRuleset} from "osu-mania-stable"
import ManiaRenderer from "../renderers/ManiaRenderer.ts";

export default class ManiaBeatmapPreviewer extends BeatmapPreviewer<ManiaBeatmap, ManiaRenderer> {
    constructor(id: string) {
        super(id, new ManiaRuleset(), (ctx, beatmap) => new ManiaRenderer(ctx, beatmap));
    }
}
