import React from 'react';
import {Picker, Icon} from 'native-base';
import styles from './styles';

const VideoFormatsPicker = ({onValueChange, selectedFormat}) => {
  return (
    <Picker
      mode="dropdown"
      iosHeader="Select your SIM"
      iosIcon={<Icon name="arrow-down" />}
      style={styles.picker}
      selectedValue={selectedFormat}
      onValueChange={e => {
        onValueChange(e);
      }}>
      <Picker.Item label="MP4" value=".mp4" />
      <Picker.Item label="AVI" value=".avi" />
      <Picker.Item label="MOV" value=".mov" />
      <Picker.Item label="FLV" value=".flv" />
    </Picker>
  );
};

export default VideoFormatsPicker;
