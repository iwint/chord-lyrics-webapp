'use client';

import { addSong, updateSong } from '@/api/api-services';
import { Icons } from '@/assets/icons/spinner-icon';
import { BEATS } from '@/constants/form-data';
import useAddSongModal from '@/hooks/use-add-modal';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { trackPromise, usePromiseTracker } from 'react-promise-tracker';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { useToast } from '../ui/use-toast';

interface SongFormProps {}

const AddSongForm: React.FC<SongFormProps> = () => {
    const { onClose, setData, data, isEdit, setEdit } = useAddSongModal();
    const { toast } = useToast();
    const queryClient = useQueryClient();
    const { promiseInProgress } = usePromiseTracker();

    const handleOnClose = () => {
        setData(null);
        setEdit(false);
        onClose();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | any) => {
        const payload = {
            ...data,
            [e.target.name]: e.target.value,
        };
        setData(payload);
    };

    const handleSubmit = async () => {
        const payload = {
            ...data,
            lyrics: JSON.stringify(data.lyrics),
        };

        try {
            let response;
            if (isEdit) {
                response = await updateSong(data._id, payload);
            } else {
                response = await addSong(payload);
            }

            if (response.status === 'ok') {
                toast({
                    title: `Song ${isEdit ? 'edited' : 'added'} successfully`,
                    variant: 'default',
                });
                await queryClient.invalidateQueries({
                    queryKey: ['my-songs'],
                });
                handleOnClose();
            }
        } catch (error) {
            toast({
                title: 'Oops! Something went wrong 💔',
                variant: 'destructive',
            });
        }
    };

    return (
        <div className="grid gap-3 grid-cols-12">
            <div className="col-span-8 gap-4 ">
                <div className="flex w-full h-full flex-col space-y-4">
                    <Label htmlFor="area">Lyrics</Label>
                    <Textarea
                        onChange={(e) => handleChange(e as any)}
                        name="lyrics"
                        value={data?.lyrics}
                        placeholder="Give your song lyrics here..."
                        className="min-h-[400px] flex-1 p-4 md:max-h-[400px] lg:max-h-[500px]"
                    />
                    <div className="flex items-center space-x-2">
                        <Button
                            disabled={data === null}
                            onClick={() => trackPromise(handleSubmit())}
                            type="submit"
                        >
                            {promiseInProgress ? (
                                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            Submit
                        </Button>
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
                                value={data?.title}
                                placeholder="Song name"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="security-level">
                                Keyboard Model
                            </Label>
                            <Input
                                name="keyboardModal"
                                id="keyboardModal"
                                value={data?.keyboardModal}
                                placeholder="Eg.Yamaha i455"
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="area">Scale</Label>
                            <Input
                                name="scale"
                                id="scale"
                                value={data?.scale}
                                placeholder="Eg.D"
                                onChange={handleChange}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="security-level">Tempo</Label>
                            <Input
                                name="tempo"
                                value={data?.tempo}
                                id="tempo"
                                placeholder="Eg.120"
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="subject">Song Language</Label>
                        <Input
                            name="language"
                            value={data?.language}
                            id="language"
                            placeholder="Eg.Tamil"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="area">Style/Rhythm</Label>
                        <Input
                            name="style"
                            id="style"
                            value={data?.style}
                            placeholder="Eg.Disco or 50"
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
    );
};

export default AddSongForm;
