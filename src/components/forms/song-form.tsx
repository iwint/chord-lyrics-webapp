'use client';

import { BEATS } from '@/constants/form-data';
import useAddSongModal from '@/hooks/use-add-modal';
import React from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useToast } from '../ui/use-toast';
import { Loader2 } from 'lucide-react';

// RTK Query
import { useCreateSongMutation, useUpdateSongMutation } from '@/lib/store/api/songsApi';

interface SongFormProps {}

const AddSongForm: React.FC<SongFormProps> = () => {
    const { onClose, setData, data, isEdit, setEdit } = useAddSongModal();
    const { toast } = useToast();

    const [createSong, { isLoading: isCreating }] = useCreateSongMutation();
    const [updateSong, { isLoading: isUpdating }] = useUpdateSongMutation();
    
    const isSubmitting = isCreating || isUpdating;

    const handleOnClose = () => {
        setData(null);
        setEdit(false);
        onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }) => {
        const payload = {
            ...data,
            [e.target.name]: e.target.value,
        };
        setData(payload);
    };

    const handleSubmit = async () => {
        // Map keyboardModal to keyboard_modal for snake_case backend
        const payload = {
            title: data.title,
            lyrics: typeof data.lyrics === 'string' ? data.lyrics : JSON.stringify(data.lyrics),
            scale: data.scale,
            tempo: data.tempo,
            language: data.language,
            style: data.style,
            beat: data.beat,
            keyboard_modal: data.keyboardModal || data.keyboard_modal,
        };

        try {
            if (isEdit && data.song_id) {
                await updateSong({ id: data.song_id, body: payload }).unwrap();
            } else {
                await createSong(payload).unwrap();
            }

            toast({
                title: `Song ${isEdit ? 'edited' : 'added'} successfully`,
                variant: 'default',
            });
            handleOnClose();
        } catch (error) {
            toast({
                title: 'Oops! Something went wrong 💔',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="grid gap-3 grid-cols-1 md:grid-cols-12 max-h-[80vh] overflow-y-auto p-1">
            <div className="col-span-1 md:col-span-8 gap-4">
                <div className="flex w-full h-full flex-col space-y-4">
                    <Label htmlFor="lyrics">Lyrics</Label>
                    <Textarea
                        onChange={(e) => handleChange(e as any)}
                        name="lyrics"
                        value={data?.lyrics || ''}
                        placeholder="[C]This is a song with chords..."
                        className="min-h-[300px] flex-1 p-4 md:max-h-[400px] lg:max-h-[500px] font-mono text-sm"
                    />
                    <div className="flex items-center space-x-2">
                        <Button
                            disabled={!data || isSubmitting}
                            onClick={handleSubmit}
                            type="button"
                            className="bg-primary hover:bg-primary/90"
                        >
                            {isSubmitting && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {isEdit ? 'Update Song' : 'Submit Song'}
                        </Button>
                    </div>
                </div>
            </div>
            <div className="col-span-1 md:col-span-4">
                <div className="grid gap-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Song name</Label>
                            <Input
                                name="title"
                                id="title"
                                value={data?.title || ''}
                                placeholder="Song name"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="keyboardModal">
                                Keyboard Model
                            </Label>
                            <Input
                                name="keyboardModal"
                                id="keyboardModal"
                                value={data?.keyboardModal || data?.keyboard_modal || ''}
                                placeholder="Eg. Yamaha i455"
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="scale">Scale</Label>
                            <Input
                                name="scale"
                                id="scale"
                                value={data?.scale || ''}
                                placeholder="Eg. D"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="tempo">Tempo</Label>
                            <Input
                                name="tempo"
                                value={data?.tempo || ''}
                                id="tempo"
                                placeholder="Eg. 120"
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="language">Song Language</Label>
                        <Input
                            name="language"
                            value={data?.language || ''}
                            id="language"
                            placeholder="Eg. Tamil"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="style">Style/Rhythm</Label>
                        <Input
                            name="style"
                            id="style"
                            value={data?.style || ''}
                            placeholder="Eg. Disco or 50"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Beat</Label>
                        <div className="flex gap-2 flex-wrap w-full">
                            {BEATS.map((beat, index) => (
                                <Badge
                                    key={index}
                                    onClick={() =>
                                        handleChange({
                                            target: {
                                                name: 'beat',
                                                value: beat,
                                            },
                                        })
                                    }
                                    variant={
                                        data?.beat === beat
                                            ? 'default'
                                            : 'outline'
                                    }
                                    className="cursor-pointer px-4 py-2 hover:bg-primary/20"
                                >
                                    {beat}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddSongForm;
