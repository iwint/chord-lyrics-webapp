export interface TABProps {
    value: string;
    label: string;
}

export const TABS: TABProps[] = [
    {
        label: "All",
        value: "all"
    },
    {
        label: "My songs",
        value: "my-songs"
    },

    {
        label: "Favourites",
        value: "favourites"
    }
]