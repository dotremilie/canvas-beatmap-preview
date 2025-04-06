import React, {FC, useEffect} from 'react';
import {IMod, ModBitwise} from "osu-classes";
import {useBeatmapPreview} from "../../contexts/BeatmapPreviewContext.tsx";
import {
    StandardDoubleTime,
    StandardEasy,
    StandardHalfTime,
    StandardHardRock,
    StandardModCombination,
    StandardNoMod
} from "osu-standard-stable";

interface ModButtonProps {
    modBitwise: ModBitwise;
}

const ModButton: FC<ModButtonProps> = ({modBitwise}) => {
    const [mod, setMod] = React.useState<IMod>(new StandardNoMod());
    const [src, setSrc] = React.useState<string | null>(null);

    const {modCombination, setModCombination} = useBeatmapPreview();

    useEffect(() => {
        switch (modBitwise) {
            case ModBitwise.Easy:
                setMod(new StandardEasy());
                setSrc("/icons/mods/ez.png");
                break;
            case ModBitwise.HalfTime:
                setMod(new StandardHalfTime());
                setSrc("/icons/mods/ht.png");
                break;
            case ModBitwise.HardRock:
                setMod(new StandardHardRock());
                setSrc("/icons/mods/hr.png");
                break;
            case ModBitwise.DoubleTime:
                setMod(new StandardDoubleTime());
                setSrc("/icons/mods/dt.png");
                break;
        }
    }, []);

    const enabled = (modCombination?.has(modBitwise) || false);

    const setEnabled = (enabled: boolean) => {
        if (!modCombination) return;

        if (enabled) {
            setModCombination(new StandardModCombination(modCombination.bitwise + modBitwise));
        } else {
            setModCombination(new StandardModCombination(modCombination.bitwise - modBitwise));
        }
    };

    const incompatible = modCombination && (modCombination?.incompatibles & mod.bitwise) !== 0;

    return (
        <button
            className={`${enabled ? "bg-primary-h2 border-primary-h1" : incompatible ? "bg-primary-b6 border-primary-b5" :"bg-primary-b3 border-primary-b2"} group flex transition-transform duration-200  border-2  rounded-lg w-full cursor-pointer`}
            onClick={() => setEnabled(!enabled)}>
            <div
                className={`flex items-center justify-center h-12 ${enabled ? "w-32" : "w-24"} group-active:w-28 rounded-md transition-width duration-200 ease-out`}>
                {
                    src && <img src={src} alt={mod.acronym} className={`h-8 w-auto ${enabled ? "opacity-100" : "opacity-50"}`}/>
                }
            </div>
            <div className={`flex flex-col w-full ${enabled ? "bg-primary-h1" : incompatible ? "bg-primary-b5" : "bg-primary-b2"} rounded-md items-start justify-center px-4`}>
                <div className="font-bold">
                    {mod.name}
                </div>
            </div>
            <div className="w-2"/>
        </button>
    );
};

export default ModButton;
