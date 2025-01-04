import {StandardRuleset} from "osu-standard-stable";
import {BeatmapDecoder} from "osu-parsers";
import StandardRenderer from "./renderers/StandardRenderer.ts";

const TIME_MULTIPLIER = 1;
const PREVIEW_TIME_FROM_BEATMAP = false;

export const createPreview = (id: string, url: string) => {
    const canvas = document.createElement('canvas') as HTMLCanvasElement;
    canvas.setAttribute('id', id);
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Canvas not supported');
    }

    canvas.width = 640;
    canvas.height = 480;
    ctx.scale(1,1);
    ctx.translate(64, 48);

    let startTime = performance.now();

    const reader = new BeatmapDecoder();
    const ruleset = new StandardRuleset();

    fetch(url).then(
        response => response.text()
    ).then(
        data => {
            const beatmap = reader.decodeFromString(data);
            const standardBeatmap = ruleset.applyToBeatmap(beatmap);
            const renderer = new StandardRenderer(ctx, standardBeatmap);

            const previewTime = PREVIEW_TIME_FROM_BEATMAP ? standardBeatmap.general.previewTime : 0;

            const animate = (currentTime: number) => {
                const time = (currentTime - startTime + previewTime) * TIME_MULTIPLIER;

                ctx.clearRect(-64, -48, canvas.width, canvas.height);
                renderer.render(time);

                if (time > beatmap.totalLength) {
                    startTime = performance.now();
                }

                requestAnimationFrame(animate);
            }

            requestAnimationFrame(animate);
        }
    )
}

createPreview('preview', '/assets/Renatus.osu');
createPreview('aspire', '/assets/aspire.osu');
createPreview('neto', '/assets/neto.osu');
