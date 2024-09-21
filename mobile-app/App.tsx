import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { useAccelerometer } from './hooks/UseAccelerometer';

export default function App() {
  const accelerometer3Axis = useAccelerometer();

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
