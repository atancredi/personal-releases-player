//
// Re-usable for every react app that implements basic music player features
//

import { createContext, useReducer, type ActionDispatch, type PropsWithChildren } from "react";



export interface IRadioRelease {
    id: string
    title: string
    artist: string
    cover?: string
    audio?: string
}



export interface IRadioData {
    isPlaying: boolean
    loadedRelease?: IRadioRelease
}
export interface IRadioDataDispatch {
    type: string,
    loadedRelease?: IRadioRelease
}
export const RadioContext = createContext<IRadioData>({ isPlaying: false });
export const RadioDispatchContext = createContext<ActionDispatch<[action: IRadioDataDispatch]>>(()=>{});


export type RadioDataReducer = (state: IRadioData, action: IRadioDataDispatch) => IRadioData;
const radioDataReducer: RadioDataReducer = (state: IRadioData, action: IRadioDataDispatch): IRadioData => {
    switch (action.type) {
        case 'load':
            return { ...state, loadedRelease: action.loadedRelease };
        case 'loadAndPlay':
            return { ...state, loadedRelease: action.loadedRelease, isPlaying: true }
        case 'play':
            return { ...state, isPlaying: true };
        case 'pause':
            return { ...state, isPlaying: false };
        case 'togglePlayPause':
            return { ...state, isPlaying: !state.isPlaying };
        case 'stop':
            return { ...state, isPlaying: false, loadedRelease: undefined }
        default:
            return state;
    }
}


export interface RadioAppProps extends PropsWithChildren {
}


export default function RadioApp({
    children
}: Readonly<RadioAppProps>) {

    const [radio, setRadio] = useReducer(radioDataReducer, { isPlaying: false });

    return (
        <RadioContext value={radio}>
            <RadioDispatchContext value={setRadio}>
                {children}
            </RadioDispatchContext>
        </RadioContext>
    )
}