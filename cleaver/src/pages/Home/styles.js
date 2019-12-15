import {StyleSheet, Dimensions} from 'react-native';

const styles = StyleSheet.create({
  header: {backgroundColor: '#6d4c41'},
  title: {color: '#efebe9'},
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
  loader: {
    marginTop: -20,
  },
  searchButton: {},
  pasteButton: {},
  progressLabel: {
    textAlign: 'center',
  },
  formLabel: {
    marginTop: 12,
    marginLeft: 8,
    color: '#222',
  },
  topRow: {
    marginTop: 26,
    elevation: 8,
    zIndex: 3,
    backgroundColor: 'white',
    height: 320,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  startStopButtonsRow: {marginTop: 90, marginBottom: 60},
  seconds: {
    textAlign: 'right',
    marginTop: 8,
    width: Dimensions.get('screen').width - 40,
  },
  slider: {
    width: Dimensions.get('screen').width - Dimensions.get('screen').width / 5,
    height: 40,
  },
  inputItem: {
    marginRight: 8,
    marginBottom: 3,
    marginLeft: 8,
  },
  formButtonsCol: {
    justifyContent: 'space-between',
    height: 100,
    marginTop: 5,
  },
  input: {
    fontSize: 15,
  },
  chkRemoveFirstSecond: {
    marginTop: 10,
    marginBottom: 20,
  },
});

export default styles;
