import React from 'react';
import {useBeatmapPreview} from "../../contexts/BeatmapPreviewContext.tsx";
import ModButton from "./ModButton.tsx";
import {ModBitwise} from "osu-classes";

const ModSelectButton = () => {
    const {modCombination} = useBeatmapPreview();

    const [open, setOpen] = React.useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-center gap-2 bg-primary-h2 font-bold text-shadow-xs min-w-24 px-4 py-1.5 rounded-lg hover:bg-primary-h1 cursor-pointer active:scale-95 transition-colors-transform-width duration-200">
                Mods
                {modCombination && modCombination?.bitwise > 0 && (
                    <div className="flex -space-x-3">
                        {
                            modCombination?.has(ModBitwise.Easy) &&
                            <img src={"/icons/mods/ez.png"} alt={"EZ"} className="h-5"/>
                        }
                        {
                            modCombination?.has(ModBitwise.HalfTime) &&
                            <img src={"/icons/mods/ht.png"} alt={"HT"} className="h-5"/>
                        }
                        {
                            modCombination?.has(ModBitwise.HardRock) &&
                            <img src={"/icons/mods/hr.png"} alt={"HR"} className="h-5"/>
                        }
                        {
                            modCombination?.has(ModBitwise.DoubleTime) &&
                            <img src={"/icons/mods/dt.png"} alt={"DT"} className="h-5"/>
                        }
                    </div>
                )}
            </button>
            {open && (
                <div
                    className="absolute top-11 right-0 rounded-lg bg-primary-b4 flex flex-col items-center gap-2 p-2 z-10 w-64">
                    <ModButton modBitwise={ModBitwise.Easy}/>
                    <ModButton modBitwise={ModBitwise.HalfTime}/>
                    <ModButton modBitwise={ModBitwise.HardRock}/>
                    <ModButton modBitwise={ModBitwise.DoubleTime}/>
                </div>
            )}
        </div>

    );
};

export default ModSelectButton;
