import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';

interface TimeContextProps {
    timestamp: number;
    setTimestamp: (timestamp: number) => void;
    totalLength: number;
    setTotalLength: (length: number) => void;
    isRunning: boolean;
    start: () => void;
    stop: () => void;
    reset: () => void;
}

const TimeContext = createContext<TimeContextProps | undefined>(undefined);

export const TimeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [timestamp, _setTimestamp] = useState<number>(0);
    const [totalLength, setTotalLength] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const animationFrameRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(0);
    const elapsedTimeRef = useRef<number>(0);

    const setTimestamp = (newTimestamp: number) => {
        _setTimestamp(newTimestamp);
        elapsedTimeRef.current = newTimestamp;

        if (isRunning) {
            startTimeRef.current = performance.now();
        }
    };

    useEffect(() => {
        const updateTime = (currentTime: number) => {
            const newTimestamp = elapsedTimeRef.current + (currentTime - startTimeRef.current);
            _setTimestamp(newTimestamp);
            animationFrameRef.current = requestAnimationFrame(updateTime);
        };

        if (isRunning) {
            startTimeRef.current = performance.now();
            animationFrameRef.current = requestAnimationFrame(updateTime);
        }

        return () => {
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isRunning]);

    useEffect(() => {
        if (totalLength > 0 && timestamp >= totalLength) {
            reset();
        }
    }, [timestamp, totalLength]);

    const start = () => {
        if (!isRunning) {
            setIsRunning(true);
            startTimeRef.current = performance.now();

            if (timestamp === 0) {
                elapsedTimeRef.current = 0;
            }
        }
    };

    const stop = () => {
        if (isRunning) {
            setIsRunning(false);
            elapsedTimeRef.current = timestamp;
        }
    };

    const reset = () => {
        setIsRunning(false);
        setTimestamp(0);
    };

    return (
        <TimeContext.Provider value={{
            timestamp,
            setTimestamp,
            totalLength,
            setTotalLength,
            isRunning,
            start,
            stop,
            reset
        }}>
            {children}
        </TimeContext.Provider>
    );
};

export const useTime = (): TimeContextProps => {
    const context = useContext(TimeContext);
    if (!context) {
        throw new Error('useTime must be used within a TimeProvider');
    }
    return context;
};
