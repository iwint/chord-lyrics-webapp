import { Icons } from '@/assets/icons/spinner-icon';
import useDeleteModal from '@/hooks/use-delete-modal';
import React from 'react';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import { Button } from '../ui/button';
import Modal from './modal';

interface DeleteModalProps {
    handleDelete: () => Promise<void>;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ handleDelete }) => {
    const { isOpen, onClose } = useDeleteModal();
    const { promiseInProgress } = usePromiseTracker();

    return (
        <Modal
            className="w-[30%] h-[25%]"
            title="Are you sure you want to delete?"
            description="This action will not reversible"
            open={isOpen}
            close={onClose}
        >
            <div className="flex w-full items-center justify-center gap-2">
                <Button
                    onClick={() => trackPromise(handleDelete())}
                    className="w-1/2"
                    variant={'destructive'}
                >
                    {promiseInProgress ? (
                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Delete
                </Button>
                <Button className="w-1/2" onClick={onClose}>
                    Close
                </Button>
            </div>
        </Modal>
    );
};

export default DeleteModal;
