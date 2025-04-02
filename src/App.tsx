import React, {useEffect} from 'react'
import './App.css'
import StandardBeatmapPreviewer from './previewers/StandardBeatmapPreviewer.ts';

function App() {
    useEffect(() => {
        const onStartup = async () => {
            console.log('Hello from the extension!');

            let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

            const [{ result: beatmapId }] = await chrome.scripting.executeScript({
                target: { tabId: tab.id! },
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
                console.log(`Beatmap ID: ${beatmapId}`);

                const previewer = new StandardBeatmapPreviewer('preview');
                previewer.loadBeatmap(`https://osu.ppy.sh/osu/${beatmapId}`).catch(console.error);
            } else {
                console.log('Nie znaleziono ID beatmapy.');
            }
        };

        onStartup();
    }, []);

    return <></>;
}

export default App;
