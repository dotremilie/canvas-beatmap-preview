import React from 'react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {TimeProvider} from "./contexts/TimeContext.tsx";
import {BeatmapPreviewProvider} from "./contexts/BeatmapPreviewContext.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <TimeProvider>
            <BeatmapPreviewProvider>
                <App />
            </BeatmapPreviewProvider>
        </TimeProvider>
    </StrictMode>,
)
