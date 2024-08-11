import { cookies } from 'next/headers';
import { SongsSection } from './songs-section';

export default async function MainPage() {
    const layout = cookies().get('react-resizable-panels:layout:mail');
    const collapsed = cookies().get('react-resizable-panels:collapsed');

    const defaultLayout = layout ? JSON.parse(layout.value) : undefined;
    const defaultCollapsed = collapsed
        ? JSON.parse(collapsed.value)
        : undefined;

    return (
        <>
            <div className="h-screen flex-col md:flex">
                <SongsSection
                    defaultLayout={defaultLayout}
                    defaultCollapsed={defaultCollapsed}
                    navCollapsedSize={4}
                />
            </div>
        </>
    );
}
