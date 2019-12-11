import FilePicker from 'react-native-file-picker';
import {ToastAndroid} from 'react-native';

const showFilePicker = () => {
  return new Promise((resolve, reject) => {
    FilePicker.showFilePicker(null, response => {
      if (response.didCancel) {
        ToastAndroid.show(
          'Você não escolheu nenhum arquivo!',
          ToastAndroid.SHORT,
        );
        resolve('');
      } else if (response.error) {
        ToastAndroid.show(response.error, ToastAndroid.LONG);
        reject(response.error);
      } else {
        const path = `file://${response.path}`;
        resolve(path);
      }
    });
  });
};

export {showFilePicker};
