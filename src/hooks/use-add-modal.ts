"use client"
import { SongSchema } from '@/models/song'
import { create } from 'zustand'

interface AddModalStoreProps {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void,
    data: SongSchema | any,
    isEdit: boolean,
    setEdit: (edit: boolean) => void
    setData: (data: SongSchema | null) => void,
}

const useAddSongModal = create<AddModalStoreProps>((set) => ({
    data: null,
    isOpen: false,
    isEdit: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false, data: null }),
    setData: (data) => set({
        data: data
    }),
    setEdit: (edit: boolean) => set({
        isEdit: edit
    }),

})
)

export default useAddSongModal