import { useCallback, useContext, useState } from "react"
import type { IRadioRelease } from "../data";
import { RadioClientContext, RadioClientDispatchContext, RadioDispatchContext, type ITrack } from "./RadioApp";

export interface IRadioReleasesListProps {
    releases: IRadioRelease[]
}

export default function RadioReleasesList({
    releases
}: Readonly<IRadioReleasesListProps>) {
    const radioAppDispatch = useContext(RadioDispatchContext);
    const radioClient = useContext(RadioClientContext);
    const radioClientDispatch = useContext(RadioClientDispatchContext);

    const handlePlayTrack = useCallback((track: ITrack, releaseFallback?: IRadioRelease) => {
        // Use fallback if context hasn't updated yet due to React state batching
        const activeRelease = releaseFallback ?? radioClient.openedRelease;

        if (!activeRelease) return;

        // Create a new track object instead of mutating the original one
        const trackToPlay: ITrack = {
            ...track,
            audio: track.audio ?? activeRelease.audio
        };

        radioAppDispatch({
            type: 'loadAndPlay',
            loadedTrack: trackToPlay,
            loadedRelease: activeRelease
        });
    }, [radioClient.openedRelease, radioAppDispatch]);

    const handleOpenAndPlayRelease = useCallback((album: IRadioRelease) => {
        radioClientDispatch({
            type: "setOpenedRelease",
            openedRelease: album
        });

        if (album.tracks && album.tracks.length > 0) {
            // Pass 'album' explicitly because 'radioClient.openedRelease' will be stale here
            handlePlayTrack(album.tracks[0], album);
        }
    }, [radioClientDispatch, handlePlayTrack]);

    const gallerySections = [
        { "name": "Latest" },
        // { "name": "Staff Picks" }
    ]
    const [openedGallerySection, setOpenedGallerySection] = useState(gallerySections[0].name)


    return (
        <div className="bg-[rgb(208,208,208,0.6)] text-black w-full flex flex-col p-[var(--space-1)]">
            <div className="[font-size:var(--text-2xl)] leading-[var(--leading-normal)]">
                {openedGallerySection}
            </div>
            <div className="
                flex flex-row gap-[var(--space-3)] justify-end 
                mb-[var(--space-4)] [font-size:var(--text-lg)]"
            >
                {
                    gallerySections.map((data, i) => (
                        <div
                            key={data.name + i}
                            onClick={() => setOpenedGallerySection(data.name)}
                            className={"" + data.name == openedGallerySection ? "border-b-2 border-black" : ""}
                        >
                            {data.name}
                        </div>
                    ))
                }
            </div>
            <div className="flex flex-col gap-[var(--space-4)]">
                {releases.map((album, i) => (
                    <ReleaseCard
                        key={album.id + i}
                        album={album}
                        handlePlayRelease={handleOpenAndPlayRelease}
                    />
                ))}
            </div>
        </div>
    )
}

export interface ReleaseCardProps {
    album: IRadioRelease;
    handlePlayRelease: (release: IRadioRelease) => void;
}

const ReleaseCard = ({ album, handlePlayRelease }: Readonly<ReleaseCardProps>) => {
    const albumCoverURL = album.cover ? new URL(album.cover, import.meta.env.VITE_S3_BUCKET_URL).href : undefined;

    return (
        <div className="flex flex-row">
            <div className="w-[50%] aspect-square rounded-[var(--radius-md)] shadow-[var(--shadow-md)] bg-[var(--bg-card)] overflow-hidden border border-[var(--border-subtle)]">
                <button onClick={() => handlePlayRelease(album)}>
                    <img
                        src={albumCoverURL}
                        alt={album.title}
                        className="w-full h-full object-cover"
                    />
                </button>
            </div>

            <div className="w-[50%] p-[var(--space-1)] py-[var(--space-3)] flex flex-col gap-(--space-1)">
                <div>
                    {album.year}
                </div>
                <div className="text-[var(--text-primary)] [font-size:var(--text-lg)] font-bold leading-tight break-all">
                    {album.title}
                </div>
                {album.artist && (
                    // <div className="text-[var(--text-secondary)] font-medium break-word position-end mt-auto">
                    <div className="text-[var(--text-primary)] font-medium break-word position-end mt-auto">
                        {album.artist}
                    </div>
                )}
                <div className="text-[var(--text-secondary)] text-(--text-sm) font-light break-all position-end flex flex-row gap-(--space-1)">
                    {album.tags?.map((v,i) => (
                        <div key={v+i} className="px-[0.15rem] w-fit rounded-md border-1 border-(--text-secondary)">
                            {v}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};