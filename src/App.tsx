import React, {useEffect, useRef, useState} from 'react'
import StandardBeatmapPreviewer from './previewers/StandardBeatmapPreviewer.ts';
import {BeatmapMetadataSection} from "osu-classes";
import {useTime} from "./contexts/TimeContext.tsx";
import BeatmapPreviewer from "./previewers/BeatmapPreviewer.ts";
import Renderer from "./renderers/Renderer.ts";

function App() {
    const [metadata, setMetadata] = useState<BeatmapMetadataSection | null>(null);
    const [loaded, setLoaded] = useState(false);

    const {timestamp, isRunning, start, stop, reset} = useTime();

    const previewerRef = useRef<BeatmapPreviewer<any, Renderer<any, any>> | null>(null);

    useEffect(() => {
        const onStartup = async () => {

            let [tab] = await chrome.tabs.query({active: true, currentWindow: true});

            let [{result: beatmapId}] = await chrome.scripting.executeScript({
                target: {tabId: tab.id!},
                func: () => {
                    const url = new URL(window.location.href);
                    const BEATMAP_URL_REGEX = /^https?:\/\/(osu|new).ppy.sh\/([bs]|beatmapsets)\/(\d+)\/?(?:#[a-zA-Z]+\/(\d+))?/i;

                    if (BEATMAP_URL_REGEX.test(url.href)) {
                        return url.href.split('/').pop();
                    }

                    return null;
                },
            });

            beatmapId = beatmapId || "557821";

            if (!previewerRef.current) {
                previewerRef.current = new StandardBeatmapPreviewer("preview");
            }

            previewerRef.current.loadBeatmap(`https://osu.ppy.sh/osu/${beatmapId}`).then(() => {
                previewerRef.current?.setStartTime(timestamp);
                setLoaded(true);

                setMetadata(previewerRef.current?.getMetadata || null);
            });
        };

        onStartup();
    }, []);

    useEffect(() => {
        if (isRunning && loaded) {
            previewerRef.current?.updateFrame(timestamp);
        }
    }, [timestamp, isRunning, loaded]);


    return (
        <>
            <h1>Beatmap Previewer</h1>
            <h2>{metadata?.artist} - {metadata?.title}</h2>
            <h3>{metadata?.creator}</h3>
            <h1>Current Animation Time: {Math.floor(timestamp)} ms</h1>
            <button onClick={isRunning ? stop : start}>
                {isRunning ? "Pause" : "Resume"}
            </button>
            <button onClick={reset}>
                Reset
            </button>
            <canvas id="preview"></canvas>
        </>
    );
}

export default App;
