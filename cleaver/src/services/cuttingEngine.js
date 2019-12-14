import {RNFFmpeg} from 'react-native-ffmpeg';
import moment from 'moment';
import FileSystem from 'react-native-fs';
import {toast} from '../utils/sysUtils';

let intervalRef = null;
let isCanceled = false;
const defaultInitialDate = '01/05/1992';

const getRepeatCount = async (filePath, seconds = 15) => {
  const mediaInformation = await RNFFmpeg.getMediaInformation(filePath);
  const totalSeconds = mediaInformation.duration / 1000;
  const slicesFloat = totalSeconds / seconds;
  return Math.floor(slicesFloat);
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

  let mom = moment(defaultInitialDate, 'DD/MM/YYYY');
  let start = mom.format('00:mm:ss');

  for (let i = 0; i < repeatCount; i += 1) {
    if (!isCanceled) {
      const pathName = getOutputFilePath(
        outputDirectory,
        filePath,
        format,
        i,
        true,
      );

      const fileExists = await FileSystem.exists(pathName);
      if (fileExists) {
        return toast(
          'O arquivo já foi fatiado nesse diretório, por favor escolha outro ou apague os vídeos previamente processados',
        );
      }

      await cut(
        filePath,
        getOutputFilePath(outputDirectory, filePath, format, i),
        start,
        seconds,
      );

      statusCallback({
        message: `Progresso ${i} de ${repeatCount - 1}...`,
        progress: {completed: i, total: repeatCount},
      });
      mom = mom.add(parseInt(seconds, 10) + 1, 'seconds');
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

const getOutputFilePath = (
  outputDirectory,
  filePath,
  format,
  i,
  isCheckingIfExists,
) => {
  return outputDirectory
    ? `${isCheckingIfExists ? '' : '"'}${
        isCheckingIfExists ? '' : 'file://'
      }${outputDirectory}/${getFileNameFromPath(filePath).replace(
        format,
        '',
      )}${i}${format}${isCheckingIfExists ? '' : '"'}`
    : `${filePath.replace(format, '')}${i}${format}`;
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
        toast('Erro ao cortar o arquivo');
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
      if (statusCallback && typeof statusCallback === 'function') {
        statusCallback(status);
      }
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
