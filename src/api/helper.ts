type prefix = "song"
type route =
    "getMySongs"
    | "addSong"
    | "getAllSongs"
    | "getIndex"
    | "getSongTitles"
    | "getSong"
    | "getlanguages"
    | "getKeyboards"
    | "getPendingSongs"
    | "getMyPendingSongs"
    | "getMySongs"
    | "getApprovedSongs"
    | "approveSong"
    | "updateSong"

type params<ID extends string, userID extends string> = `userId=${userID}`
    | `language=${ID}`
    | `index=${ID}`
    | `${ID}`
    | `keyboard=${ID}`
    | `${ID}?userId=${userID}`

type path<UserId extends string, ID extends string> = `${prefix}/${route}`
    | `${prefix}/${route}/${params<ID, UserId>}`
    | any

export type ENDPOINT = path<string, string>
