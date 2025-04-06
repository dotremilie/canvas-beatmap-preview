import React, {createContext, ReactNode, useContext, useEffect, useRef, useState} from 'react';
import {StandardBeatmap, StandardModCombination} from "osu-standard-stable";
import StandardBeatmapPreviewer from "../previewers/StandardBeatmapPreviewer.ts";
import {useTime} from "./TimeContext.tsx";
import {BeatmapDifficultySection, BeatmapMetadataSection, RulesetBeatmap} from "osu-classes";

interface BeatmapPreviewContextProps {
    beatmapId: string | null;
    setBeatmapId: (id: string | null) => void;
    modCombination: StandardModCombination | null;
    setModCombination: (combination: StandardModCombination | null) => void;
    previewerRef: React.RefObject<StandardBeatmapPreviewer | null>;
    loadBeatmap: () => Promise<boolean>;
    metadata: BeatmapMetadataSection | null;
    difficulty: BeatmapDifficultySection | null;
}

const BeatmapPreviewContext = createContext<BeatmapPreviewContextProps | undefined>(undefined);

let cachedBeatmap: RulesetBeatmap | null = null;

export const BeatmapPreviewProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [beatmapId, setBeatmapId] = useState<string | null>(null);
    const [metadata, setMetadata] = useState<BeatmapMetadataSection | null>(null);
    const [difficulty, setDifficulty] = useState<BeatmapDifficultySection | null>(null);
    const [modCombination, setModCombination] = useState<StandardModCombination | null>(null);

    const {setTotalLength} = useTime();

    const previewerRef = useRef<StandardBeatmapPreviewer | null>(null);

    const loadBeatmap = () => new Promise<boolean>(async (resolve) => {
        if (!previewerRef.current) {
            resolve(false);
            return;
        }

        const currentModsBitwise = modCombination?.bitwise ?? 0;

        if (cachedBeatmap?.metadata.beatmapId === Number(beatmapId)) {
            try {
                await previewerRef.current.loadBeatmap(cachedBeatmap.clone() as StandardBeatmap, currentModsBitwise);

                const beatmap = previewerRef.current.getBeatmap;

                setTotalLength(beatmap.totalLength || 1000);
                setDifficulty(beatmap.difficulty);

                resolve(true);
                return;
            } catch (error) {
                console.error('Failed to load from cache', error);
                cachedBeatmap = null;
            }
        }

        try {
            await previewerRef.current.loadBeatmapFromUrl(`https://osu.ppy.sh/osu/${beatmapId}`, currentModsBitwise);

            const beatmap = previewerRef.current.getBeatmap;

            if (beatmap) {
                cachedBeatmap = beatmap.clone();

                setTotalLength(beatmap.totalLength || 1000);
                setMetadata(beatmap.metadata || null);
                setDifficulty(beatmap.difficulty || null);

                resolve(true);
            } else {
                resolve(false);
            }
        } catch (error) {
            console.error('Failed to load beatmap', error);
            resolve(false);
        }
    });

    useEffect(() => {
        loadBeatmap();
    }, [beatmapId, modCombination]);

    return (
        <BeatmapPreviewContext.Provider
            value={{
                beatmapId,
                setBeatmapId,
                modCombination,
                setModCombination,
                previewerRef,
                loadBeatmap,
                metadata,
                difficulty
            }}>
            {children}
        </BeatmapPreviewContext.Provider>
    );
};

export const useBeatmapPreview = (): BeatmapPreviewContextProps => {
    const context = useContext(BeatmapPreviewContext);

    if (!context) {
        throw new Error('useBeatmapPreview must be used within a BeatmapPreviewProvider');
    }

    return context;
};
