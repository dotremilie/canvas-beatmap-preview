import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TimelineContextProps {
  currentTime: number;
  setCurrentTime: (time: number) => void;
}

const TimelineContext = createContext<TimelineContextProps | undefined>(undefined);

export const TimelineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTime, setCurrentTime] = useState<number>(0);

  return (
    <TimelineContext.Provider value={{ currentTime, setCurrentTime }}>
      {children}
    </TimelineContext.Provider>
  );
};

export const useTimeline = (): TimelineContextProps => {
  const context = useContext(TimelineContext);
  if (!context) {
    throw new Error('useTimeline must be used within a TimelineProvider');
  }
  return context;
};
