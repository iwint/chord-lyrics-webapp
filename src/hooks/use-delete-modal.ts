"use client"
import { create } from 'zustand'

interface UseDeleteModalProps {
    isOpen: boolean
    onOpen: () => void
    onClose: () => void,

}

const useDeleteModal = create<UseDeleteModalProps>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),


})
)

export default useDeleteModal