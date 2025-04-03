import React, { createContext, useContext, useState, ReactNode } from 'react';

interface BeatmapPreviewContextProps {
    beatmapId: string | null;
    setBeatmapId: (id: string | null) => void;
}

const BeatmapPreviewContext = createContext<BeatmapPreviewContextProps | undefined>(undefined);

export const BeatmapPreviewProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [beatmapId, setBeatmapId] = useState<string | null>(null);

    return (
        <BeatmapPreviewContext.Provider value={{ beatmapId, setBeatmapId }}>
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
