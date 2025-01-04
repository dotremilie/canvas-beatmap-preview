import StandardBeatmapPreviewer from './previewers/StandardBeatmapPreviewer.ts';

export const TIME_MULTIPLIER = 1;
export const PREVIEW_TIME_FROM_BEATMAP = false;

new StandardBeatmapPreviewer('preview').loadBeatmap('/assets/Renatus.osu').catch(console.error);
new StandardBeatmapPreviewer('aspire').loadBeatmap('/assets/aspire.osu').catch(console.error);
new StandardBeatmapPreviewer('neto').loadBeatmap('/assets/neto.osu').catch(console.error);
