import {StyleSheet, Dimensions} from 'react-native';

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 6,
    top: -60,
  },
  mainCol: {
    backgroundColor: '#f5f5f5',
    height: Dimensions.get('screen').height,
    paddingHorizontal: 6,
  },
  progressRow: {
    top: -130,
  },
  progressLabel: {
    textAlign: 'center',
  },
  formLabel: {
    marginTop: 10,
    marginLeft: 8,
    color: '#222',
  },
  topRow: {marginTop: 26},
  startStopButtonsRow: {marginTop: 200},
  seconds: {
    textAlign: 'center',
    marginTop: 8,
  },
  slider: {
    width: Dimensions.get('screen').width / 2,
    height: 40,
  },
});

export default styles;
