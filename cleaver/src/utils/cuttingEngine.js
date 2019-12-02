import {RNFFmpeg} from 'react-native-ffmpeg';

let intervalRef = null;

const getHowManySlices = async (filePath, seconds = 15) => {
  const mediaInformation = await RNFFmpeg.getMediaInformation(filePath);
  const totalSeconds = mediaInformation.duration / 1000;
  return Math.floor(totalSeconds / seconds) + 1;
};

const cut = async (
  filePath,
  start = '00',
  end = '15',
  statusCallback,
  finishedCallback,
) => {
  RNFFmpeg.resetStatistics();

  RNFFmpeg.execute(
    ` -ss ${start} -i ${filePath} -t ${end} ${filePath}.output.mp4`,
  )
    .then(() => {
      clearInterval(intervalRef);
      console.log('execution finished');
    })
    .catch(err => {
      clearInterval(intervalRef);
      throw new Error(err);
    });
  //   RNFFmpeg.enableLogCallback(data => {}); // redirecionar logs do console para cá
  intervalRef = setInterval(() => {
    RNFFmpeg.getLastReceivedStatistics().then(status => {
      if (status.time / 1000 >= end) {
        clearInterval(intervalRef);
        finishedCallback();
      }
      statusCallback(status);
    });
  }, 30);
};

const cancel = () => {
  RNFFmpeg.cancel();
  clearInterval(intervalRef);
  return 'Processo cancelado com sucesso!';
};

export {cut, cancel};
