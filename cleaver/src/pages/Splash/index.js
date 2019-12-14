/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, Image, View} from 'react-native';
import image from '../../assets/imgs/icon.png';

export const Splash = () => {
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: '#6d4c41',
      }}>
      <Image source={image} fadeDuration={1000} />
      <Text
        style={{
          color: '#f5f5f5',
          fontSize: 30,
          marginTop: 15,
          fontWeight: 'bold',
        }}>
        Cleaver
      </Text>
    </View>
  );
};
