import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

interface SocketClient {
    join: (roomId: string) => void;
    sendMessage: (roomId: string, message:string) => void;
    sendMessageWithMySelf: (roomId: string, message:string) => void;
    setReceiveMessageEvent: (listener: EventLister) => void;
}

interface EventLister {
    receive: (message: string) => void
}

const initializeSocket = (
    url: string,
): Socket => {
    const socket = io(url, {
        transports: ["websocket"],
    });

    socket.io.on("ping", () => {
        console.log("ping server")
    });
    
    socket.on("connect_error", (error: any) => {
        console.log("接続に失敗しました")
        console.log(error)
    });

    return socket;
}

export const useWebSocket = (
    url: string,
): SocketClient => {
    const [socket, setSocket] = useState<Socket|null>(null);
    const [pingTimerId, setPingTimerId] = useState<NodeJS.Timeout|null>(null);
    const [eventListener, setEventListener] = useState<EventLister|null>(null);
    const [roomId, setRoomId] = useState("");

    useEffect(() => {
        const socket = initializeSocket(url);
        const intervalId = setInterval(() => {
            if (socket != null) {
                socket?.emit("ping", "ping");
            }
        }, 10000)
        setPingTimerId(intervalId);
        setSocket(socket);
        return () => {
            if (pingTimerId != null) {
                clearInterval(pingTimerId);
            }
            socket?.close();
        }
    }, []);

    useEffect(() => {
        if (socket === null) {
            console.log("socketが初期化されていません");

            return;
        }
        socket?.on("receive", (msg: string) => { 
            console.log("イベントを受け取りました " + msg);
            if (eventListener === null) {
                console.log("listenerがnullです")

                return;
            }
            eventListener?.receive(msg);
        });

        console.log("receiveイベントを初期化しました");
    }, [socket, eventListener])

    useEffect(() => {
        if (roomId === "") {
            return;
        }

        socket?.emit("join", roomId);
    }, [socket, roomId])

    return {
        join: (roomId: string) => {
            setRoomId(roomId);
        },
        sendMessage: (roomId, message) => {
            socket?.emit("send", {
                roomId: roomId,
                jsonMessage: message
            });
        },
        sendMessageWithMySelf: (roomId, message) => {
            socket?.emit("sendWithMySelf", {
                roomId: roomId,
                jsonMessage: message
            });
        },
        setReceiveMessageEvent: (listener: EventLister) => {
            console.log("イベントを設定します");
            setEventListener(listener);
        }
    }
}
