import BeatmapPreviewer from "./BeatmapPreviewer.ts";
import {StandardBeatmap, StandardRuleset} from "osu-standard-stable";
import StandardRenderer from "../renderers/StandardRenderer.ts";

export default class StandardBeatmapPreview extends BeatmapPreviewer<StandardBeatmap, StandardRenderer> {
    constructor(id: string) {
        super(id, new StandardRuleset(), (ctx, beatmap) => new StandardRenderer(ctx, beatmap));
    }
}
