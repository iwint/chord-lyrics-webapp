import { songs } from "@/assets/data/dummy-data";
import { TABS } from "@/constants/tab-data";
import { SongSchema } from "@/models/song";
import { atom, useAtom } from "jotai";
import { TABProps } from './../constants/tab-data';


type Config = {
    selected: SongSchema["_id"] | null,
    currentTab: TABProps
}

const configAtom = atom<Config>({
    selected: songs[0]._id,
    currentTab: TABS[0]
})

export function useSongs() {
    return useAtom(configAtom)
}
