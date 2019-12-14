import FilePicker from 'react-native-file-picker';
import {toast} from './sysUtils';

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
        resolve(`file://${response.path}`);
      }
    });
  });
};

export {showFilePicker};
