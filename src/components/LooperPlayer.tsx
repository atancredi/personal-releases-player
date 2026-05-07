import { useContext, useEffect } from 'react'
import ReactHowler from 'react-howler'
import { RadioContext, RadioDispatchContext } from './RadioApp/RadioApp';


export interface LooperPlayerProps {
}

export default function LooperPlayer({
}: Readonly<LooperPlayerProps>) {

    const radioApp = useContext(RadioContext);
    const radioAppDispatch = useContext(RadioDispatchContext);


    const onSongEnd = () => {
        // console.log("song ended")
        radioAppDispatch({
            type: 'stop'
        })
    }


    useEffect(() => {
        if (radioApp.loadedRelease != undefined && 'mediaSession' in navigator) {
            const artworkURL = new URL(radioApp.loadedRelease.cover, import.meta.env.VITE_S3_BUCKET_URL).href;
            navigator.mediaSession.metadata = new MediaMetadata({
                title: radioApp.loadedRelease.title,
                artist: radioApp.loadedRelease.artist,
                // album: 'obviouschoice radio',
                artwork: [
                    { src: artworkURL, sizes: '1250x1250', type: 'image/png' },
                ]
            });

            navigator.mediaSession.setActionHandler('play', () => {
                radioAppDispatch({
                    type: 'play'
                })
            });

            navigator.mediaSession.setActionHandler('pause', () => {
                radioAppDispatch({
                    type: 'pause'
                })
            });

            navigator.mediaSession.setActionHandler('stop', () => {
                radioAppDispatch({
                    type: 'stop'
                })
            });

        }
    }, [radioApp.loadedRelease])

    return (
        <>
            {
                radioApp.loadedRelease != undefined && (
                    <ReactHowler
                        src={new URL(radioApp.loadedRelease.audio, import.meta.env.VITE_S3_BUCKET_URL).href}
                        playing={radioApp.isPlaying}
                        html5={true}

                        onEnd={() => onSongEnd()}
                    />
                )
            }
        </>
    )

}