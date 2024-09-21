import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Accelerometer, AccelerometerMeasurement } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { Subscription } from 'expo-sensors/build/Pedometer';

interface Accelerometer3Axis {
  x: number
  y: number
  z: number
}

const round = (n: number | null) => {
  if (!n) {
    return 0;
  }

  return Math.floor(n * 100);
};

export default function App() {
  const [accelerometer3Axis, setAccelerometer3Axis] = useState<AccelerometerMeasurement>({
    x: 0,
    y: 0,
    z: 0,
    timestamp: 0,
  });
  const [
    accelerometer3AxisSubscription,
    setSubscriptionAccelerometer3AxisSubscription
  ] = useState<Subscription|null>(null);

  const _subscribe = () => {
    Accelerometer.setUpdateInterval(100);
    setSubscriptionAccelerometer3AxisSubscription(Accelerometer.addListener(setAccelerometer3Axis));
  };

  const _unsubscribe = () => {
    accelerometer3AxisSubscription && accelerometer3AxisSubscription.remove();
    setSubscriptionAccelerometer3AxisSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
      <Text style={styles.text}>x: {round(accelerometer3Axis.x)}</Text>
      <Text style={styles.text}>y: {round(accelerometer3Axis.y)}</Text>
      <Text style={styles.text}>z: {round(accelerometer3Axis.z)}</Text>
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
