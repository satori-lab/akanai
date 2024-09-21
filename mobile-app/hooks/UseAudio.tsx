import { useEffect, useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { Audio } from 'expo-av';

interface SoundPlayer {
    play: () => Promise<void>
    stop: () => Promise<void>
}

// anyとしているが使うものは音声ファイルを対象にrequireしたもの
export const useAudio = (soundSource: any, isLooping: boolean): SoundPlayer => {
    const [sound, setSound] = useState<Audio.Sound|null>(null);

    useEffect(() => {
        (async() => {
            const { sound } = await Audio.Sound.createAsync(soundSource, {isLooping: isLooping});
            setSound(sound);
        })()
        return () => {
            (async() => {
                await sound?.unloadAsync();
            })()
        }
    }, []);

    return {
        play: async () => {
            await sound?.playAsync(); 
        },
        stop: async () => {
            await sound?.stopAsync(); 
        }
    }
}
