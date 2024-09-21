import { AccelerometerMeasurement, Accelerometer } from "expo-sensors";
import { Subscription } from "expo-sensors/build/Pedometer";
import { useState, useEffect } from "react";

const round = (n: number | null) => {
    if (!n) {
      return 0;
    }
  
    return Math.floor(n * 100);
};

export const useAccelerometer = (updateInterval: number): AccelerometerMeasurement => {
    const [accelerometer3Axis, setAccelerometer3Axis] = useState<AccelerometerMeasurement>({
        x: 0,
        y: 0,
        z: 0,
        timestamp: 0,
    });

    const accelerometerListener = (measurement: AccelerometerMeasurement) => {
        setAccelerometer3Axis(
            {
                x: round(measurement.x),
                y: round(measurement.y),
                z: round(measurement.z),
                timestamp: measurement.timestamp
            }
        )
    }

    const [
        subscription,
        setSubscription
    ] = useState<Subscription | null>(null);

    const _subscribe = () => {
        Accelerometer.setUpdateInterval(updateInterval);
        setSubscription(Accelerometer.addListener(accelerometerListener));
    };

    const _unsubscribe = () => {
        subscription && subscription.remove();
        setSubscription(null);
    };

    useEffect(() => {
        _subscribe();
        return () => _unsubscribe();
    }, []);

    return accelerometer3Axis;
}