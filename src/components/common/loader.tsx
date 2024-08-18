import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

interface LoaderProps {
    isLoading: boolean;
}

export default function Loader({ isLoading }: LoaderProps) {
    return (
        <Box sx={{ width: '100%' }}>
            {isLoading ? (
                <LinearProgress color="inherit" />
            ) : (
                <div className="h-[4px]" />
            )}
        </Box>
    );
}
