import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useAccelerometer } from './hooks/UseAccelerometer';
import { useAudio } from './hooks/UseAudio';
import { useEffect, useState } from 'react';
import { SoundSource } from './const/sound';

const threshold = 80;

export default function App() {
  const [beforeZ, setBeforeZ] = useState(1000);
  const accelerometer3Axis = useAccelerometer(100);
  const buzzerSound = useAudio(SoundSource.Buzzer, true);

  useEffect(
    () => {
      (async() => {
        setBeforeZ(accelerometer3Axis.z);
        // 60以下がだいたい表 そうなったら音を鳴らす
        if (beforeZ > threshold && accelerometer3Axis.z <= threshold) {
          console.log("音楽を再生します");
          await buzzerSound.play();
        }

        // 60以上がだいたい裏 そうなったら再生を止める
        if (beforeZ <= threshold && accelerometer3Axis.z > threshold) {
          console.log("音楽を停止します");
          await buzzerSound.stop();
        }
      })()
    }, [accelerometer3Axis.z]);

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
      <Text style={styles.text}>x: {accelerometer3Axis.x}</Text>
      <Text style={styles.text}>y: {accelerometer3Axis.y}</Text>
      <Text style={styles.text}>z: {accelerometer3Axis.z}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
});
