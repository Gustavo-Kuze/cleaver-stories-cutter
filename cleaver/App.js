/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  StatusBar,
  Dimensions,
  ToastAndroid,
} from 'react-native';

import {
  Container,
  Header,
  Button,
  Form,
  Input,
  Item,
  Text,
  Icon,
  Body,
  Title,
} from 'native-base';
import {Col, Row, Grid} from 'react-native-easy-grid';

import FilePicker from 'react-native-file-picker';
import {RNFFmpeg} from 'react-native-ffmpeg';

// video path storage/emulated/0/Download/video.mp4

const App: () => React$Node = () => {
  const [filePath, setFilePath] = useState('');

  const showFilePicker = () => {
    FilePicker.showFilePicker(null, response => {
      if (response.didCancel) {
        ToastAndroid.show(
          'Você não escolheu nenhum arquivo!',
          ToastAndroid.SHORT,
        );
      } else if (response.error) {
        ToastAndroid.show(response.error, ToastAndroid.LONG);
      } else {
        const path = `file://${response.path}`;
        setFilePath(path);
      }
    });
  };

  const processCutting = () => {
    if (!filePath) {
      ToastAndroid.show(
        'Você ainda não escolheu um arquivo!',
        ToastAndroid.SHORT,
      );
    }

    RNFFmpeg.getMediaInformation(filePath)
      .then(info => {
        console.log('Result: ' + JSON.stringify(info));
      })
      .catch(err => console.error(err));

    RNFFmpeg.execute(
      ` -ss 00:00:00 -i ${filePath} -to 00:00:15 ${filePath}.output.mp4`,
    ).then(result => console.log('FFmpeg process exited with rc ' + result.rc));
  };

  const cancelCutting = () => {
    RNFFmpeg.cancel();
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <Container>
            <Header>
              <Body>
                <Title>Cleaver</Title>
              </Body>
            </Header>
            <Grid>
              <Row>
                <Col style={styles.mainCol}>
                  <Row style={{marginTop: 50}}>
                    <Col size={10}>
                      <Form>
                        <Item>
                          <Input
                            placeholder="Caminho do arquivo de vídeo"
                            value={filePath}
                          />
                        </Item>
                      </Form>
                    </Col>
                    <Col size={4} style={styles.searchButton}>
                      <Button
                        rounded
                        info
                        onPress={showFilePicker}
                        style={styles.button}>
                        <Icon type="FontAwesome" name="search" />
                      </Button>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Button
                        danger
                        bordered
                        onPress={cancelCutting}
                        style={styles.button}>
                        <Text>Cancelar</Text>
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        success
                        onPress={processCutting}
                        style={styles.button}>
                        <Text>Processar</Text>
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Grid>
          </Container>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  button: {
    marginHorizontal: 24,
    // position: 'absolute',
    top: -200,
  },
  searchButton: {
    // position: 'absolute',
    // right: 100,
    top: 200,
  },
  mainCol: {
    backgroundColor: '#f5f5f5',
    height: Dimensions.get('screen').height,
  },
});

export default App;
