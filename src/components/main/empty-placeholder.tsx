import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

export function EmptyPlaceholder() {
    const Beats = ['1/4', '2/4', '3/4', '4/4', '6/8', '7/8'];

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

                <h3 className="mt-4 text-lg font-semibold">No songs added</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                    You have not added any songs. Add one below.
                </p>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="sm" className="relative">
                            Add Song
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[80%] h-[90%]">
                        <DialogHeader>
                            <DialogTitle>Add Song</DialogTitle>
                            <DialogDescription>
                                Fill the form below to add your song.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-3 grid-cols-12">
                            <div className="col-span-8 gap-4 ">
                                <div className="flex w-full h-full flex-col space-y-4">
                                    <Label htmlFor="area">Lyrics</Label>
                                    <Textarea
                                        placeholder="Give your song lyrics here..."
                                        className="min-h-[400px] flex-1 p-4 md:max-h-[400px] lg:max-h-[500px]"
                                    />
                                    <div className="flex items-center space-x-2">
                                        <Button>Submit</Button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-4">
                                <div className="grid gap-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="area">
                                                Song name
                                            </Label>
                                            <Input
                                                id="title"
                                                placeholder="I need help with..."
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="security-level">
                                                Keyboard Model
                                            </Label>
                                            <Input
                                                id="keyboardModal"
                                                placeholder="Eg.Yamaha i455"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="area">Scale</Label>
                                            <Input
                                                id="scale"
                                                placeholder="Eg.D"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="security-level">
                                                Tempo
                                            </Label>
                                            <Input
                                                id="tempo"
                                                placeholder="Eg.120"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="subject">
                                            Song Language
                                        </Label>
                                        <Input
                                            id="language"
                                            placeholder="Eg.Tamil"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="area">
                                            Style/Rhythm
                                        </Label>
                                        <Input
                                            id="style"
                                            placeholder="Eg.Disco or 50"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Beat</Label>
                                        <div className="flex gap-2 flex-wrap w-full">
                                            {Beats.map((beat, index) => (
                                                <Badge
                                                    key={index}
                                                    onClick={() => {}}
                                                    variant={'outline'}
                                                    className="cursor-pointer px-4 py-2"
                                                >
                                                    {beat}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
