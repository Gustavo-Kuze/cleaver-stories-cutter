import FilePicker from 'react-native-file-picker';
import {toast} from './sysUtils';

const isSupportedFileType = filePath => {
  const splited = filePath.split('.');
  const fileType = splited[splited.length - 1];
  return (
    fileType === 'mp4' ||
    fileType === 'avi' ||
    fileType === 'flv' ||
    fileType === 'mov'
  );
};

const showFilePicker = () => {
  return new Promise((resolve, reject) => {
    FilePicker.showFilePicker(null, response => {
      if (response.didCancel) {
        toast('Você não escolheu nenhum arquivo!');
        resolve('');
      } else if (response.error) {
        toast(response.error);
        reject(response.error);
      } else {
        if (!isSupportedFileType(response.path)) {
          return toast(
            'Por favor, selecione um arquivo de vídeo em um dos formatos suportados!',
          );
        }
        resolve(`file://${response.path}`);
      }
    });
  });
};

export {showFilePicker};
