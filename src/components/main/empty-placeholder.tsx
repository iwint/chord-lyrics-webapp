import useAddSongModal from '@/hooks/use-add-modal';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

interface EmptyPlaceholderProps {
    title?: string;
    description?: string;
    isActionView?: boolean;
}

export function EmptyPlaceholder({
    isActionView,
    description,
    title,
}: EmptyPlaceholderProps) {
    const { onOpen } = useAddSongModal();
    const token = Cookies.get('token');
    const router = useRouter();

    const handleAddSong = () => {
        if (token) {
            onOpen();
        } else {
            router.push('/login');
        }
    };

    return (
        <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-10 w-10 text-muted-foreground"
                    viewBox="0 0 24 24"
                >
                    <circle cx="12" cy="11" r="1" />
                    <path d="M11 17a1 1 0 0 1 2 0c0 .5-.34 3-.5 4.5a.5.5 0 0 1-1 0c-.16-1.5-.5-4-.5-4.5ZM8 14a5 5 0 1 1 8 0" />
                    <path d="M17 18.5a9 9 0 1 0-10 0" />
                </svg>
                <h3 className="mt-4 text-lg font-semibold">
                    {title ? title : 'No songs added'}
                </h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                    {description
                        ? description
                        : 'You have not added any songs. Add one below.'}
                </p>
                {isActionView && (
                    <Button onClick={handleAddSong}>Add song</Button>
                )}
            </div>
        </div>
    );
}
