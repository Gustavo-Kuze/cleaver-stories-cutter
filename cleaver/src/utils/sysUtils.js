import {ToastAndroid} from 'react-native';
const toast = (msg, duration = ToastAndroid.LONG) =>
  ToastAndroid.show(msg, duration);

export {toast};
