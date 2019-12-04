import {RNFFmpeg} from 'react-native-ffmpeg';
import moment from 'moment';

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

  let mom = moment('01/05/1992', 'DD/MM/YYYY');
  let start = mom.format('00:mm:ss');
  mom = mom.add(seconds, 'seconds');
  let end = mom.format('00:mm:ss');

  for (let i = 0; i < repeatCount; i += 1) {
    await cut(
      filePath,
      `${filePath.replace('.mp4', '')}${i}.mp4`,
      start,
      end,
      status => {},
    );
    statusCallback({
      message: `Concluído ${i} de ${repeatCount}...`,
      progress: {completed: i, total: repeatCount},
    });
    start = mom.format('00:mm:ss');
    mom = mom.add(seconds, 'seconds');
    end = mom.format('00:mm:ss');
  }
  statusCallback({
    message: 'Tudo pronto!',
  });
};

const cut = async (filePath, outputFileName, start, end, statusCallback) => {
  return new Promise((res, rej) => {
    RNFFmpeg.resetStatistics();
    RNFFmpeg.execute(
      ` -ss ${start} -i ${filePath} -to ${end} -c copy ${outputFileName}`,
    )
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
    }, 5);
  });
};

const cancel = () => {
  RNFFmpeg.cancel();
  clearInterval(intervalRef);
  return 'Processo cancelado com sucesso!';
};

export {cutRepeatedly, cancel};
