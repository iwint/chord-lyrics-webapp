'use client';

import { addSong } from '@/api/api-services';
import { BEATS } from '@/constants/form-data';
import useAddSongModal from '@/hooks/use-add-modal';
import { useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useToast } from '../ui/use-toast';

interface AddSongFormProps {}

const AddSongForm: React.FC<AddSongFormProps> = () => {
    const { onClose } = useAddSongModal();
    const [selectedBeat, setSelectBeat] = useState<string | null>(null);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const handleSubmit = async (formData: FormData) => {
        const payload = {
            title: formData.get('title'),
            scale: formData.get('scale'),
            tempo: formData.get('tempo'),
            style: formData.get('style'),
            beat: selectedBeat,
            language: formData.get('language'),
            keyboardModal: formData.get('keyboardModal'),
            lyrics: JSON.stringify(formData.get('lyrics')),
        };
        try {
            const response = await addSong(payload);
            console.log(response);

            if (response.status === 'ok') {
                toast({
                    title: 'Song added successfully',
                    variant: 'default',
                });
                queryClient.invalidateQueries({
                    queryKey: ['songs'],
                });
                onClose();
            }
        } catch (error) {
            toast({
                title: 'Oops! Something went wrong 💔',
                variant: 'destructive',
            });
        }
    };

    return (
        <form action={handleSubmit} className="grid gap-3 grid-cols-12">
            <div className="col-span-8 gap-4 ">
                <div className="flex w-full h-full flex-col space-y-4">
                    <Label htmlFor="area">Lyrics</Label>
                    <Textarea
                        name="lyrics"
                        placeholder="Give your song lyrics here..."
                        className="min-h-[400px] flex-1 p-4 md:max-h-[400px] lg:max-h-[500px]"
                    />
                    <div className="flex items-center space-x-2">
                        <Button type="submit">Submit</Button>
                    </div>
                </div>
            </div>
            <div className="col-span-4">
                <div className="grid gap-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="area">Song name</Label>
                            <Input
                                name="title"
                                id="title"
                                placeholder="I need help with..."
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="security-level">
                                Keyboard Model
                            </Label>
                            <Input
                                name="keyboardModal"
                                id="keyboardModal"
                                placeholder="Eg.Yamaha i455"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="area">Scale</Label>
                            <Input name="scale" id="scale" placeholder="Eg.D" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="security-level">Tempo</Label>
                            <Input
                                name="tempo"
                                id="tempo"
                                placeholder="Eg.120"
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="subject">Song Language</Label>
                        <Input
                            name="language"
                            id="language"
                            placeholder="Eg.Tamil"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="area">Style/Rhythm</Label>
                        <Input
                            name="style"
                            id="style"
                            placeholder="Eg.Disco or 50"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label>Beat</Label>
                        <div className="flex gap-2 flex-wrap w-full">
                            {BEATS.map((beat, index) => (
                                <Badge
                                    key={index}
                                    onClick={() => setSelectBeat(beat)}
                                    variant={
                                        selectedBeat === beat
                                            ? 'default'
                                            : 'outline'
                                    }
                                    className="cursor-pointer px-4 py-2"
                                >
                                    {beat}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default AddSongForm;
