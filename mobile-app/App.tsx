import { ColorValue, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { useAccelerometer } from './hooks/UseAccelerometer';
import { useAudio } from './hooks/UseAudio';
import { useEffect, useState } from 'react';
import { SoundSource } from './const/sound';
import { useWebSocket } from './hooks/UseWebSocket';
import { generateUUID } from './utils/uuid';
import { cloneObject } from './utils/copy';

const threshold = 80;
const roomId = "sound";
const url = "http://192.168.11.62:8080/";
const backgroundImage = require("./assets/background.png");

interface SumahoStatusMessage {
  indivisualId: string
  isOpen: boolean
}

export default function App() {
  const [beforeZ, setBeforeZ] = useState(1000);
  const accelerometer3Axis = useAccelerometer(100);
  const buzzerSound = useAudio(SoundSource.Buzzer, true);
  const socketClient = useWebSocket(url);

  // 固有値の生成
  const [individualId, _] = useState(generateUUID());
  
  // 誰が開いているかの状態を保持する
  const [sumahoOpenMap, setSumahoOpenMap] = useState<{[key: string]: boolean}>({});

  useEffect(() => {
    socketClient.join(roomId);
    socketClient.setReceiveMessageEvent({ receive: (message: string|undefined) => {
      if (message === undefined) {
        console.log("不明なメッセージを受け取りました");
        return;
      }
      const resMessage: SumahoStatusMessage = JSON.parse(message);
      const copyMap = cloneObject(sumahoOpenMap);
      copyMap[resMessage.indivisualId] = resMessage.isOpen;
      setSumahoOpenMap(copyMap);

      console.log("参加者のステータス更新が完了しました");
    }})
    
    console.log(individualId + "が" + roomId + "に参加しました");
  }, []);

  useEffect(() => {
    (async() => {
      for (const key in sumahoOpenMap) {
        if (sumahoOpenMap[key]) {
          console.log(individualId + "が違反しています");

          await buzzerSound.play();

          return;
        }
      }

      console.log("全員スマホを裏返したので再生を止めます");
      await buzzerSound.stop();
    })()
  }, [sumahoOpenMap])

  useEffect(
    () => {
      (async() => {
        setBeforeZ(accelerometer3Axis.z);
        // 60以下がだいたい表 そうなったら音を鳴らす
        if (beforeZ > threshold && accelerometer3Axis.z <= threshold) {
          console.log(individualId + " 私は違反者です");
          const sendMessage: SumahoStatusMessage = {
            indivisualId: individualId,
            isOpen: true
          }
          socketClient.sendMessageWithMySelf(
            roomId,
            JSON.stringify(sendMessage)
          );
        }

        // 60以上がだいたい裏 そうなったら再生を止める
        if (beforeZ <= threshold && accelerometer3Axis.z > threshold) {
          console.log(individualId + " スマホを手放しました");

          const sendMessage: SumahoStatusMessage = {
            indivisualId: individualId,
            isOpen: false
          }

          socketClient.sendMessageWithMySelf(
            roomId,
            JSON.stringify(sendMessage)
          );
        }
      })()
    }, [accelerometer3Axis.z]);

  return (
    <View style={styles.container}>
      <ImageBackground source={backgroundImage} style={styles.image}>
      {/* <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
      <Text style={styles.text}>x: {accelerometer3Axis.x}</Text>
      <Text style={styles.text}>y: {accelerometer3Axis.y}</Text>
      <Text style={styles.text}>z: {accelerometer3Axis.z}</Text> */}
      <View style={styles.timerBox}>
        <View style={[{ flex: 5 }]}>
          <Text style={styles.timerText}>01</Text>
        </View>
        <View style={[{ flex: 1 }]}>
          <Text style={styles.timerTextSplit}>:</Text>
        </View>
        <View style={[{ flex: 5 }]}>
          <Text style={styles.timerText}>48</Text>
        </View>
        <View style={[{ flex: 1 }]}>
          <Text style={styles.timerTextSplit}>:</Text>
        </View>
        <View style={[{ flex: 5 }]}>
          <Text style={styles.timerText}>34</Text>
        </View>
      </View>
      </ImageBackground>
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
  image: {
    flex: 1,
    resizeMode: "stretch",
    width: '100%',
    height: '100%',
    justifyContent: "center"
  },
  timerBox: {
    flex: 1,
    width:'100%',
    height:'30%',
    left: '0%',
    top: '35%',
    position:'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 80,
    color: "black",
    textAlign: 'center',
  },
  timerTextSplit: {
    fontSize: 50,
    color: "black",
    textAlign: 'center',
  }
});

const bg = (backgroundColor: ColorValue, opacity: number = 0.2) => {
  return {
    backgroundColor,
    opacity,
  };
};
