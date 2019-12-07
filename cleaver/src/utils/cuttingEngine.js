import {RNFFmpeg} from 'react-native-ffmpeg';
import moment from 'moment';
import {ToastAndroid} from 'react-native';

let intervalRef = null;
let isCanceled = false;

const getRepeatCount = async (filePath, seconds = 15) => {
  const mediaInformation = await RNFFmpeg.getMediaInformation(filePath);
  const totalSeconds = mediaInformation.duration / 1000;
  const slicesFloat = totalSeconds / seconds;
  return (
    Math.floor(slicesFloat) + (Math.floor(slicesFloat) < slicesFloat ? 1 : 0)
  );
};

const getFileNameFromPath = path => {
  const splited = path.split('/');
  return splited[splited.length - 1];
};

const sliceVideo = async (
  filePath,
  statusCallback,
  seconds = 14,
  format = 'mp4',
  outputDirectory = '',
) => {
  isCanceled = false;
  const repeatCount = await getRepeatCount(filePath, seconds);

  let mom = moment('01/05/1992', 'DD/MM/YYYY');
  let start = mom.format('00:mm:ss');

  for (let i = 0; i < repeatCount; i += 1) {
    if (!isCanceled) {
      await cut(
        filePath,
        outputDirectory
          ? `"file://${outputDirectory}/${getFileNameFromPath(filePath).replace(
              format,
              '',
            )}${i}${format}"`
          : `${filePath.replace(format, '')}${i}${format}`,
        start,
        seconds,
        status => {},
      );
      statusCallback({
        message: `Progresso ${i} de ${repeatCount}...`,
        progress: {completed: i, total: repeatCount},
      });
      mom = mom.add(seconds, 'seconds');
      start = mom.format('00:mm:ss');
    }
  }
  if (!isCanceled) {
    statusCallback({
      message: 'Vídeo fatiado com sucesso!',
    });
  } else {
    statusCallback({
      message: 'Processo cancelado',
    });
  }
};

const cut = async (
  filePath,
  outputFileName,
  start,
  seconds,
  statusCallback,
) => {
  return new Promise((res, rej) => {
    RNFFmpeg.resetStatistics();
    RNFFmpeg.enableLogCallback(log => {
      if (log.log.includes('Conversion failed')) {
        ToastAndroid.show('Erro ao cortar o arquivo', ToastAndroid.LONG);
        cancel();
      }
    });
    RNFFmpeg.execute(
      ` -ss ${start} -i ${filePath} -t ${seconds} -c copy ${outputFileName}`,
    )
      .then(() => {
        clearInterval(intervalRef);
        res();
      })
      .catch(err => {
        clearInterval(intervalRef);
        return rej(new Error(err));
      });
    intervalRef = setInterval(async () => {
      const status = await RNFFmpeg.getLastReceivedStatistics();
      if (status.time / 1000 >= seconds) {
        clearInterval(intervalRef);
        return;
      }
      statusCallback(status);
    }, 5);
  });
};

const cancel = () => {
  isCanceled = true;
  RNFFmpeg.cancel();
  clearInterval(intervalRef);
  return 'Processo cancelado pelo usuário!';
};

export {sliceVideo, cancel};
