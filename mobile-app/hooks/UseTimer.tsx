import { useTimer as useLibTimer } from 'react-timer-hook';

const addTimeToNow = (addSeconds: number): Date => {
    const time = new Date();
    time.setSeconds(time.getSeconds() + addSeconds);

    return time;
}

interface Timer {
    restSeconds: number
    restMinutes: number
    restHours: number
}

export const useTimer = (
    timeSeconds: number,
    onExpire: () => void,
): Timer => {
    const {
        totalSeconds,
        seconds,
        minutes,
        hours,
        days,
        isRunning,
        start,
        pause,
        resume,
        restart,
    } = useLibTimer({ 
        expiryTimestamp: addTimeToNow(timeSeconds),
        onExpire: () => onExpire }
    );

    return {
        restSeconds: seconds,
        restMinutes: minutes,
        restHours: hours,
    }
}