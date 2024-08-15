"use client"
import { create } from 'zustand'

interface AddModalStoreProps {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void,
}

const useAddSongModal = create<AddModalStoreProps>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false })
})
)

export default useAddSongModal