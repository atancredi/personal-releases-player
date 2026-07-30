// depends on react-howler
//  npm install --save react-howler 
//  npm i --save-dev @types/react-howler

import { useEffect, useReducer, createContext, type ActionDispatch, type PropsWithChildren, useRef } from "react";
import { } from "react";

import * as ReactHowlerNamespace from 'react-howler';
import type { IRadioRelease } from "../data";
const ReactHowler = (ReactHowlerNamespace.default || ReactHowlerNamespace) as any;


/// Types ///////////////////////////////////////////////////////////////////////////////////////////////////
// Audio data
export interface IAudioFeatures {
    bpm?: number
}

export interface IAudioMetadata {
    id: string
    title: string
    artist?: string
}

export interface ITrack extends IAudioMetadata {
    audio?: string
    cover?: string

    features?: IAudioFeatures

    // ADDED
    timestamp?: number // in case it's a cuePoint
}

// Radio app state
export interface IRadioAppState {
    isPlaying: boolean
    volume: number
    tempo: number

    seek?: number

    loadedTrack?: ITrack
    loadedRelease?: IRadioRelease

    seekTrigger?: number
}

export interface IRadioAppStateDispatch extends Partial<IRadioAppState> {
    type: string
}

/// Context ////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const RadioContext = createContext<IRadioAppState>({ isPlaying: false, volume: 1, tempo: 1.0 });
export const RadioDispatchContext = createContext<ActionDispatch<[action: IRadioAppStateDispatch]>>(() => { });

export const RadioPlayerRefContext = createContext<React.RefObject<any> | null>(null);

export type RadioDataReducer = (state: IRadioAppState, action: IRadioAppStateDispatch) => IRadioAppState;
export const radioDataReducer: RadioDataReducer = (state: IRadioAppState, action: IRadioAppStateDispatch): IRadioAppState => {
    switch (action.type) {
        case 'load':
            return {
                ...state,
                loadedTrack: action.loadedTrack,
                loadedRelease: action.loadedRelease,
                seek: action.loadedTrack?.timestamp,
                seekTrigger: Date.now()
            };
        case 'loadAndPlay':
            return {
                ...state,
                loadedTrack: action.loadedTrack,
                loadedRelease: action.loadedRelease,
                seek: action.loadedTrack?.timestamp,
                seekTrigger: Date.now(),
                isPlaying: true,
            };
        case 'play':
            return { ...state, isPlaying: true };
        case 'pause':
            return { ...state, isPlaying: false };
        case 'togglePlayPause':
            return { ...state, isPlaying: !state.isPlaying };
        case 'stop':
            return { ...state, isPlaying: false, loadedTrack: undefined, loadedRelease: undefined, seek: undefined };
        case 'setVolume':
            if (action.volume != undefined)
                return { ...state, volume: action.volume };
            return state;
        case 'setTempo':
            if (action.tempo != undefined)
                return { ...state, tempo: action.tempo }
            return state;
        case 'updateReleaseMetadata':
            return { ...state, loadedRelease: action.loadedRelease };
        case 'updateTrackMetadata':
            return { ...state, loadedTrack: action.loadedTrack };
        default:
            return state;
    }
}



export interface IRadioClientState {
    openedRelease?: IRadioRelease
}
export interface IRadioClientStateDispatch extends Partial<IRadioClientState> {
    type: string
}

export const RadioClientContext = createContext<IRadioClientState>({});
export const RadioClientDispatchContext = createContext<ActionDispatch<[action: IRadioClientStateDispatch]>>(() => { });


export type RadioClientDataReducer = (state: IRadioClientState, action: IRadioClientStateDispatch) => IRadioClientState;
export const radioClientReducer: RadioClientDataReducer = (state: IRadioClientState, action: IRadioClientStateDispatch): IRadioClientState => {
    switch (action.type) {
        case 'setOpenedRelease':
            return {
                ...state,
                openedRelease: action.openedRelease,
            };
        default:
            return state;
    }
}





/// Provider + Player Component ///////////////////////////////////////////////////////////////////////////////////////
export interface RadioAppProps extends PropsWithChildren {
    storageBucketBaseURL: string
}


export default function RadioApp({
    children,
    storageBucketBaseURL
}: Readonly<RadioAppProps>) {

    const [radio, radioDispatch] = useReducer(radioDataReducer, { isPlaying: false, volume: 1, tempo: 1.0 });
    const playerRef = useRef<any>(null);

    const [radioClient, radioClientDispatch] = useReducer(radioClientReducer, {});

    // 1. We ONLY keep this effect for when you manually scrub/seek during an already playing track.
    // (e.g., if you add a progress bar later).
    useEffect(() => {
        // We ensure the player exists and that we aren't constantly re-seeking to the current position
        console.log("seek update", radio.seek)
        if (radio.seek !== undefined && playerRef.current) {
            playerRef.current.seek(radio.seek);
        }
    }, [radio.seek, radio.seekTrigger]);

    // DELETED: The `useEffect` tracking `radio.isPlaying` is gone. 
    // It was causing race conditions. We will use the `playing` prop below instead.

    useEffect(() => {
        if (radioClient.openedRelease?.cover != undefined && 'mediaSession' in navigator) {
            const artworkURL = new URL(radioClient.openedRelease.cover, storageBucketBaseURL).href;
            navigator.mediaSession.metadata = new MediaMetadata({
                title: radioClient.openedRelease.title,
                artist: radioClient.openedRelease.artist,
                artwork: [
                    { src: artworkURL, sizes: '1250x1250', type: 'image/png' },
                ]
            });

            navigator.mediaSession.setActionHandler('play', () => radioDispatch({ type: 'play' }));
            navigator.mediaSession.setActionHandler('pause', () => radioDispatch({ type: 'pause' }));
            navigator.mediaSession.setActionHandler('stop', () => radioDispatch({ type: 'stop' }));
        }
    }, [radioClient.openedRelease, storageBucketBaseURL]); // Added storageBucketBaseURL to dependencies

    return (
        <RadioContext.Provider value={radio}>
            <RadioDispatchContext.Provider value={radioDispatch}>
                <RadioPlayerRefContext.Provider value={playerRef}>
                    <RadioClientContext.Provider value={radioClient}>
                        <RadioClientDispatchContext.Provider value={radioClientDispatch}>
                            {children}
                            {
                                radio.loadedTrack?.audio != undefined && (
                                    <ReactHowler
                                        ref={playerRef}
                                        src={new URL(radio.loadedTrack.audio, storageBucketBaseURL).href}

                                        // 2. UNCOMMENTED: Let ReactHowler manage play state!
                                        playing={radio.isPlaying}
                                        html5={false}
                                        volume={radio.volume}
                                        rate={radio.tempo}

                                        // 3. THE MAGIC FIX: Wait for the track to buffer before seeking.
                                        onLoad={() => {
                                            if (radio.seek !== undefined && playerRef.current) {
                                                playerRef.current.seek(radio.seek);
                                            }
                                        }}

                                        // Optional fallback: If the browser blocks autoplay and delays 
                                        // the play event, ensure the seek is enforced when it finally starts.
                                        onPlay={() => {
                                            if (radio.seek !== undefined && playerRef.current) {
                                                const currentPosition = playerRef.current.seek();
                                                if (currentPosition === 0 && radio.seek > 0) {
                                                    playerRef.current.seek(radio.seek);
                                                }
                                            }
                                        }}
                                    />
                                )
                            }
                        </RadioClientDispatchContext.Provider>
                    </RadioClientContext.Provider>
                </RadioPlayerRefContext.Provider>
            </RadioDispatchContext.Provider>
        </RadioContext.Provider >
    )
}