import React, {useEffect} from 'react'
import StandardBeatmapPreviewer from './previewers/StandardBeatmapPreviewer.ts';
import {BeatmapMetadataSection} from "osu-classes";

function App() {
    const [metadata, setMetadata] = React.useState<BeatmapMetadataSection | null>(null);

    useEffect(() => {
        const onStartup = async () => {
            let [tab] = await chrome.tabs.query({active: true, currentWindow: true});

            const [{result: beatmapId}] = await chrome.scripting.executeScript({
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

            if (beatmapId) {
                const previewer = new StandardBeatmapPreviewer('preview');
                previewer.loadBeatmap(`https://osu.ppy.sh/osu/${beatmapId}`).catch(console.error);
                setMetadata(previewer.getMetadata);
            } else {
                console.error('Beatmap ID not found');
            }

            console.log(metadata);
        };

        onStartup();
    }, []);


    return (
        <>
            <canvas id="preview"></canvas>
        </>
    );
}

export default App;
