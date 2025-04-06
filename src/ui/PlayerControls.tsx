import React from 'react';
import {MdPause, MdPlayArrow, MdStop, MdVisibility, MdVisibilityOff} from "react-icons/md";
import {formatTime} from "../utils/TimeUtils.ts";
import {useTime} from "../contexts/TimeContext.tsx";
import {getTrackBackground, Range} from "react-range";

const PlayerControls = () => {
    const [hidden, setHidden] = React.useState(false);

    const {timestamp, setTimestamp, totalLength, isRunning, start, stop, reset} = useTime();

    const values = [isNaN(timestamp / totalLength) ? 0 : timestamp / totalLength];

    return (
        <div
            className={`w-full p-2 absolute bottom-0 opacity-75 hover:opacity-100 flex flex-col gap-2 ${hidden && "translate-y-18"} transition-transform-opacity duration-200 ease-in-out`}>
            <button
                onClick={() => setHidden(!hidden)}
                className="flex items-center justify-center gap-2 bg-primary-b4 font-bold text-shadow-xs w-24 px-4 py-1.5 rounded-lg hover:bg-primary-h2 cursor-pointer active:scale-95 transition-colors-transform duration-200 self-end">
                {
                    hidden ? (
                        <>
                            <MdVisibility/>
                            Show
                        </>
                    ) : (
                        <><MdVisibilityOff/>
                            Hide
                        </>
                    )
                }
            </button>
            <div className="rounded-lg overflow-hidden flex grow">
                <div className="flex gap-2 bg-primary-b4 p-4">
                    <div className="flex items-center">
                        {
                            isRunning ? (
                                <button onClick={stop}
                                        className="hover:opacity-85 active:scale-95 transition-opacity-scale duration-200 cursor-pointer">
                                    <MdPause className="size-8"/></button>
                            ) : (
                                <button onClick={start}
                                        className="hover:opacity-85 active:scale-95 transition-opacity-scale duration-200 cursor-pointer">
                                    <MdPlayArrow className="size-8"/></button>
                            )
                        }

                        <button onClick={reset}
                                className="hover:opacity-85 active:scale-95 transition-opacity-scale duration-200 cursor-pointer">
                            <MdStop className="size-8"/></button>
                    </div>

                    <div className="flex items-center w-24 gap-2 justify-center">
                        <div className="font-bold">
                            {formatTime(Number((timestamp / 1000).toFixed()))}
                        </div>
                        <div className="text-primary-foreground">
                            {isNaN(totalLength) ? "00:00" : formatTime(Number((totalLength / 1000).toFixed()))}
                        </div>
                    </div>
                </div>


                <Range
                    min={0}
                    max={1}
                    step={0.01}
                    values={values}
                    onChange={(values) => {
                        setTimestamp(values[0] * totalLength);
                    }}
                    renderTrack={({props, children}) => (
                        <div
                            onMouseDown={props.onMouseDown}
                            onTouchStart={props.onTouchStart}
                            style={{...props.style}}
                            className="group flex items-center justify-center w-full bg-primary-b5 p-4 px-8"
                        >
                            <div
                                ref={props.ref}
                                style={{
                                    background: getTrackBackground({
                                        values,
                                        colors: ["#66ccff", "#444f53"],
                                        min: 0,
                                        max: 1,
                                    })
                                }}
                                className="self-center w-full h-[3px] rounded-full"
                            >
                                {children}
                            </div>
                        </div>
                    )}
                    renderThumb={({props, isDragged}) => (
                        <div
                            {...props}
                            key={props.key}
                            style={{...props.style}}
                            className="flex items-center justify-center rounded-full"
                        >
                            <div
                                className={`h-3 w-9 rounded-full ring-2 ring-primary-h1 bg-primary-b5 hover:bg-primary-h1 ${isDragged && "bg-primary-h1 scale-95"} transition-colors-transform duration-200 flex items-center justify-center`}>
                                <div className="size-[4px] rounded-full bg-primary-h1"/>
                            </div>
                        </div>
                    )}/>
            </div>
        </div>

    );
};

export default PlayerControls;
