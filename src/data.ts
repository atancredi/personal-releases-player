import type { ITrack } from "./components/RadioApp"


export interface IRadioRelease {
    id: string
    title: string
    artist?: string
    cover?: string
    audio?: string

    tracks?: ITrack[]

    year?: string
    tags?: string[]
}


export const releases: IRadioRelease[] = [
    // {
    //     "id": "algofobia",
    //     "title": "algofobia",
    //     "artist": "Grande Fumo",
    //     "cover": "algofobia3.png",
    //     "audio": "flixbusv4.mp3"
    // },
    {
        "id": "meritatoriposo",
        "title": "Meritato Riposo",
        "artist": "Grande Fumo",
        "year": "2022",
        "cover": "meritatoriposo-cover-lowres-d8.png",
        "audio": "meritatoriposo-full.mp3",
        "tracks": [
            {
                id: "1",
                title: "2",
                timestamp: 0
            },
            {
                id: "2",
                title: "ravioli",
                timestamp: 102
            },
            {
                id: "3",
                title: "sogno",
                timestamp: 174
            },
            {
                id: "4",
                title: "cammino",
                timestamp: 258
            },
            {
                id: "5",
                title: "tutto",
                timestamp: 340
            },
            {
                id: "6",
                title: "meritato riposo",
                timestamp: 406
            }
        ],
        "tags": ["beats"]
    },
    {
        "id": "space",
        "title": "space",
        "artist": "Grande Fumo",
        "year": "2022",
        "cover": "space-cover-d8.png",
        "audio": "space-full.mp3",
        "tracks": [
            {
                id: "1",
                title: "space",
                timestamp: 0
            },
        ],
        "tags": ["beats"]
    },
    {
        "id": "oliva",
        "title": "oliva",
        "artist": "Grande Fumo x SUPERFLUIDO",
        "year": "2022",
        "cover": "oliva-cover-d8.png",
        "audio": "oliva-full.mp3",
        "tracks": [
            {
                id: "1",
                title: "oliva",
                timestamp: 0
            },
        ],
        "tags": ["rap","album"]
    },
]

export interface IRadioProfileInfo {
    name: string
    profilePicURL: string
}

export const mockProfileInfo = {
    name: "Grande Fumo",
    profilePicURL: "images/propic2-d16.png"
}
