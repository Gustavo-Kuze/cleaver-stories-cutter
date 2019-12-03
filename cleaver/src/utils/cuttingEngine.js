import {RNFFmpeg} from 'react-native-ffmpeg';

let intervalRef = null;

const getRepeatCount = async (filePath, seconds = 15) => {
  const mediaInformation = await RNFFmpeg.getMediaInformation(filePath);
  const totalSeconds = mediaInformation.duration / 1000;
  const slicesFloat = totalSeconds / seconds;
  return (
    Math.floor(slicesFloat) + (Math.floor(slicesFloat) < slicesFloat ? 1 : 0)
  );
};

const cutRepeatedly = async (filePath, statusCallback, seconds = 15) => {
  const repeatCount = await getRepeatCount(filePath, seconds);
  let start = 0;
  let end = seconds;
  for (let i = 0; i < repeatCount; i += 1) {
    await cut(
      filePath,
      `${filePath.replace('.mp4', '')}${i}.mp4`,
      start < 10 ? `0${start}` : `${start}`,
      `${end}`,
      status => {},
    );
    console.log('start: ' + start);
    console.log('end: ' + end);
    statusCallback('Finalizou: ' + i);
    start += seconds;
    end += seconds;
  }
};

const cut = async (filePath, outputFileName, start, end, statusCallback) => {
  return new Promise((res, rej) => {
    RNFFmpeg.resetStatistics();
    RNFFmpeg.execute(` -ss ${start} -i ${filePath} -t ${end} ${outputFileName}`)
      .then(() => {
        clearInterval(intervalRef);
        console.log('execution finished');
        res();
      })
      .catch(err => {
        clearInterval(intervalRef);
        return rej(new Error(err));
      });
    intervalRef = setInterval(async () => {
      const status = await RNFFmpeg.getLastReceivedStatistics();
      if (status.time / 1000 >= end) {
        clearInterval(intervalRef);
        return;
      }
      statusCallback(status);
    }, 30);
  });
};

const cancel = () => {
  RNFFmpeg.cancel();
  clearInterval(intervalRef);
  return 'Processo cancelado com sucesso!';
};

export {cutRepeatedly, cancel};
