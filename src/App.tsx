import React, {useEffect, useState} from 'react'
import StandardBeatmapPreviewer from './previewers/StandardBeatmapPreviewer.ts';
import {useTime} from "./contexts/TimeContext.tsx";
import PlayerControls from "./ui/PlayerControls.tsx";
import {FaStar} from "react-icons/fa6";
import ModSelectButton from "./ui/mods/ModSelectButton.tsx";
import {useBeatmapPreview} from "./contexts/BeatmapPreviewContext.tsx";
import {StandardModCombination} from "osu-standard-stable";

function App() {
    const [loaded, setLoaded] = useState(false);

    const {timestamp, isRunning, start} = useTime();
    const {setBeatmapId, setModCombination, previewerRef, loadBeatmap, metadata, difficulty} = useBeatmapPreview();

    useEffect(() => {
        const onStartup = async () => {

            let [tab] = await chrome.tabs.query({active: true, currentWindow: true});

            let [{result}] = await chrome.scripting.executeScript({
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

            setBeatmapId(result ?? null);
            setModCombination(new StandardModCombination());

            previewerRef.current = new StandardBeatmapPreviewer("preview");
            loadBeatmap().then(() => {
                setLoaded(true);
                start();
            }).catch(console.error);
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
            <div className="flex items-center justify-between bg-primary-b4 p-4">
                <div className="flex flex-col">
                    <div className="flex items-baseline w-full gap-1.5 max-w-full truncate">
                        <span className="text-2xl font-bold truncate">
                            {metadata?.title}
                        </span>
                        <span className="text-xl truncate">
                            {metadata?.artist}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 w-full">
                        <div className="text-xl">&#10687;</div>
                        <div className="flex items-baseline w-full gap-1.5">
                        <span className="font-bold">
                            {metadata?.version}
                        </span>
                            <span className="font-light text-primary-l1">
                            mapped by
                        </span>
                            <span className="">
                            {metadata?.creator}
                        </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-6 bg-primary-b5 py-2 px-4 rounded-lg">
                    <div className="grid grid-cols-2 gap-x-4 text-sm flex-1">
                        <div className="flex justify-between gap-4">
                            <div>
                                CS
                            </div>
                            <div className="font-bold">
                                {difficulty && difficulty?.circleSize % 1 !== 0 ? difficulty?.circleSize.toFixed(1) : difficulty?.circleSize.toFixed(0)}
                            </div>
                        </div>
                        <div className="flex justify-between gap-4">
                            <div>
                                AR
                            </div>
                            <div className="font-bold">
                                {difficulty && difficulty?.approachRate % 1 !== 0 ? difficulty?.approachRate.toFixed(1) : difficulty?.approachRate.toFixed(0)}
                            </div>
                        </div>

                        <div className="flex justify-between gap-4">
                            <div>
                                OD
                            </div>
                            <div className="font-bold">
                                {difficulty && difficulty?.overallDifficulty % 1 !== 0 ? difficulty?.overallDifficulty.toFixed(1) : difficulty?.overallDifficulty.toFixed(0)}
                            </div>
                        </div>

                        <div className="flex justify-between gap-4">
                            <div>
                                HP
                            </div>
                            <div className="font-bold">
                                {difficulty && difficulty?.drainRate % 1 !== 0 ? difficulty?.drainRate.toFixed(1) : difficulty?.drainRate.toFixed(0)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative">
                <div className="absolute flex z-10 p-2 w-full items-end justify-end">
                    <ModSelectButton/>
                </div>

                <div
                    style={{backgroundImage: `url('https://assets.ppy.sh/beatmaps/${metadata?.beatmapSetId}/covers/cover@2x.jpg')`}}
                    className="bg-cover bg-center w-[640px] h-[480px] bg-primary-b6">
                    <canvas id="preview" className="w-full h-full bg-black/25 backdrop-blur-sm"></canvas>
                </div>

                <PlayerControls/>
            </div>
        </>
    );
}

export default App;
