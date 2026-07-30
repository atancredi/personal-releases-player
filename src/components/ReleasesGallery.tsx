// import { useCallback, useContext, useState } from "react";
// import { releases, type IRadioRelease } from "../data";
import { releases } from "../data";

import './ReleasesGalleryTheme.css';
// import {
//     RadioClientContext,
//     RadioClientDispatchContext,
//     RadioContext,
//     RadioDispatchContext,
//     type ITrack
// } from "./RadioApp";
// import VolumeSlider from "./VolumeSlider";
import RadioMiniPlayer from "./RadioMiniPlayer";
import RadioReleasesList from "./RadioReleasesList";
// import ScrollingText from "./ScrollingText/ScrollingText";

export interface ReleasesGalleryProps { }

const ReleasesGalleryV2 = (_props: Readonly<ReleasesGalleryProps>) => {
    // Context Consumption
    // const radioApp = useContext(RadioContext);
    // const radioAppDispatch = useContext(RadioDispatchContext);
    // const radioClient = useContext(RadioClientContext);
    // const radioClientDispatch = useContext(RadioClientDispatchContext);

    // const closeRelease = () => radioClientDispatch({
    //     type: "setOpenedRelease",
    //     openedRelease: undefined
    // });

    // const handlePlayTrack = useCallback((track: ITrack, releaseFallback?: IRadioRelease) => {
    //     // Use fallback if context hasn't updated yet due to React state batching
    //     const activeRelease = releaseFallback ?? radioClient.openedRelease;

    //     if (!activeRelease) return;

    //     // Create a new track object instead of mutating the original one
    //     const trackToPlay: ITrack = {
    //         ...track,
    //         audio: track.audio ?? activeRelease.audio
    //     };

    //     radioAppDispatch({
    //         type: 'loadAndPlay',
    //         loadedTrack: trackToPlay,
    //         loadedRelease: activeRelease
    //     });
    // }, [radioClient.openedRelease, radioAppDispatch]);


    return (
        <>
            <div className="fixed inset-0 overflow-y-auto overscroll-none">
                {/* <div className="w-full sticky top-0 min-h-[86px] bg-black/20 backdrop-blur-md
                    shadow transform-gpu will-change-transform flex flex-col px-[var(--space-1)]
                ">
                    <div className="flex flex-row justify-between my-[var(--space-1)]">
                        <div>archive</div>
                        <div>shop</div>
                        <div>menu</div>
                    </div>
                    <div className="m-auto mb-[var(--space-3)]">
                        <img className="h-full" src={new URL("logos/logowhite.png", import.meta.env.VITE_S3_BUCKET_URL).href} />
                    </div>
                    <div className="w-full">
                        <ScrollingText>Latest Episode: Smoketto emememmememmemem</ScrollingText>
                    </div>
                </div> */}
                {/* <div className="h-[var(--space-4)]"></div>
                <div className="h-[var(--space-4)]"></div>
                <div className="h-[var(--space-4)]"></div>
                <div className="h-[var(--space-4)]"></div> */}
                <div className="p-[var(--space-3)] mb-[var(--mini-player-h)]">
                    <RadioReleasesList releases={releases}></RadioReleasesList>
                </div>
                <div>
                    <div>
                        <img className="h-full" src={new URL("logos/logotransparentwhite.png", import.meta.env.VITE_S3_BUCKET_URL).href}></img>
                    </div>
                    <div className="flex flex-row justify-between px-(--space-2)">
                        <div>obviouschoice radio</div>
                        <div>2026, Rome, Italy</div>
                    </div>
                </div>
                {/* <div className="h-[var(--mini-player-h)] my-[var(--space-2)]"></div> */}
                <div className="h-[10rem]"></div>
            </div>
            {/* {!radioClient.openedRelease ? (
                
            ) : (
                <div className="fixed inset-0 overflow-y-auto overscroll-none">
                    <div className="my-2">
                        <button onClick={closeRelease}>close</button>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex flex-col">
                            {radioClient.openedRelease.tracks?.map((track, i) => (
                                <button onClick={() => handlePlayTrack(track)} key={track.id + i}>
                                    <div className="my-1">
                                        {track.title}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <VolumeSlider />

                        {radioApp.loadedTrack && (
                            <div className="h-[var(--mini-player-h)] my-[var(--space-2)]"></div>
                        )}
                    </div>
                </div>
            )} */}



            <RadioMiniPlayer />
        </>
    );
};



export default ReleasesGalleryV2;