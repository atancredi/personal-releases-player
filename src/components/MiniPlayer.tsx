import { useContext } from "react";
import { RadioContext, RadioDispatchContext } from "./RadioApp/RadioApp";


export interface MiniPlayerProps {
}

export default function MiniPlayer({
}: Readonly<MiniPlayerProps>) {


    const radioApp = useContext(RadioContext);
    const radioAppDispatch = useContext(RadioDispatchContext);


    const togglePlayPause = () => {
        // console.log("dispatch togglePlayPause")
        radioAppDispatch({
            type: 'togglePlayPause'
        })
    }

    const stop = () => {
        // console.log("dispatch stop")
        radioAppDispatch({
            type: 'stop'
        })
    }


    return radioApp.loadedRelease?.cover != undefined && (

        <div className="h-[var(--mini-player-h)] bg-[var(--bg-surface)] fixed bottom-0 py-[var(--space-2)] border-t-1 border-black px-[var(--space-3)] w-full flex flex-row gap-[var(--space-2)] justify-between">
            <div className="">
                <img
                    className={"h-full rounded-[var(--radius-sm)]"}
                    src={new URL(radioApp.loadedRelease?.cover, import.meta.env.VITE_S3_BUCKET_URL).href}
                    alt={radioApp.loadedRelease.artist + " - " + radioApp.loadedRelease.title}
                />
            </div>
            <div className="grow h-full flex flex-row justify-between">
                <div className="flex flex-col h-full justify-center">
                    <div className="[font-size:var(--text-base)] font-bold">{radioApp.loadedRelease.title}</div>
                    <div className="[font-size:var(--text-sm)]">{radioApp.loadedRelease.artist}</div>
                </div>
                <div className="flex flex-row gap-[var(--space-3)]">
                    <div className="flex flex-col justify-center">
                        <div>
                            <button onClick={() => togglePlayPause()}>
                                {radioApp.isPlaying ? 'pause' : 'play'}
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center">
                        <div>
                            <button onClick={() => stop()}>
                                stop
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}