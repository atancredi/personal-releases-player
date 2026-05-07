import { useContext } from "react";
import { RadioContext, RadioDispatchContext, type IRadioRelease } from "./RadioApp/RadioApp";
import LooperPlayer from "./LooperPlayer";
import MiniPlayer from "./MiniPlayer";
import { profileInfo, releases } from "../data";

import './ReleasesGalleryTheme.css';

export interface ReleasesGalleryProps {
}


const ReleasesGallery = ({

}: Readonly<ReleasesGalleryProps>) => {

    const radioApp = useContext(RadioContext);
    const radioAppDispatch = useContext(RadioDispatchContext);


    const handlePlayRelease = (release: IRadioRelease) => {
        // console.log("play release", release)

        if (radioApp.loadedRelease?.audio != release.audio) {
            // console.log("dispatch loadAndPlay", release.audio)
            radioAppDispatch({
                type: 'loadAndPlay',
                loadedRelease: release,
            })
        }

    };

    const profilePicURL = new URL(profileInfo.profilePicURL, import.meta.env.VITE_S3_BUCKET_URL).href;

    return (
        <>
            <div className="fixed inset-0 overflow-y-auto overscroll-none">
                <div className="flex flex-col">

                    <div className="relative mb-[var(--space-4)]">

                        <div className="h-[60svh] ">
                            <img className="h-full w-full object-cover" loading="eager" src={profilePicURL} alt={profileInfo.name} />
                        </div>

                        <div className="absolute bottom-0 text-white mix-blend-color-dodge [font-size:var(--text-2xl)] leading-[var(--leading-snug)] px-[var(--space-1)]">
                            {profileInfo.name}
                        </div>

                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-[var(--space-3)] p-[var(--space-3)] mb-[var(--mini-player-h)]">
                        {releases.map((album, i) => (
                            <ReleasesGallery.Release key={album.id + i} album={album} handlePlayRelease={handlePlayRelease} />
                        ))}
                    </div>

                </div>

                {radioApp.loadedRelease != undefined && (<div className="h-[var(--mini-player-h)] my-[var(--space-2)]" ></div>)}

            </div>

            <LooperPlayer />
            <MiniPlayer></MiniPlayer>

        </>

    );
}




export interface ReleaseProps {
    album: any,
    handlePlayRelease: (release: any) => void
}
ReleasesGallery.Release = ({
    album,
    handlePlayRelease
}: Readonly<ReleaseProps>) => {

    const albumCoverURL = new URL(album.cover, import.meta.env.VITE_S3_BUCKET_URL).href;


    return (
        <div className="flex flex-col gap-[var(--space-2)]">

            <div className="w-full aspect-square rounded-[var(--radius-md)] shadow-[var(--shadow-md)] bg-[var(--bg-card)] overflow-hidden border border-[var(--border-subtle)]">
                <button
                    onClick={() => handlePlayRelease(album)}
                >
                    <img
                        src={albumCoverURL}
                        alt={album.title}
                        className="w-full h-full object-cover"
                        // className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                </button>
            </div>

            <div className="px-1">
                <h2 className="text-[var(--text-primary)] font-bold [font-size:var(--text-base)] leading-tight break-all">
                    {album.title}
                </h2>
                <p className="text-[var(--text-secondary)] font-medium [font-size:var(--text-sm)] mt-1 break-all">
                    {album.artist}
                </p>
            </div>

        </div>
    )
}


export default ReleasesGallery;
