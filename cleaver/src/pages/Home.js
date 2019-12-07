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
  Clipboard,
} from 'react-native';
import Slider from '@react-native-community/slider';
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
  Spinner,
  Picker,
} from 'native-base';
import {Col, Row, Grid} from 'react-native-easy-grid';
import FilePicker from 'react-native-file-picker';
import {sliceVideo, cancel} from '../utils/cuttingEngine';

// video path storage/emulated/0/Download/video.mp4

const Home: () => React$Node = () => {
  const [filePath, setFilePath] = useState('');
  const [outputPath, setOutputPath] = useState('');
  const [progressStatus, setProgressStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [isProcessStarted, setIsProcessStarted] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('.mp4');
  const [seconds, setSeconds] = useState(15);

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

  const startCutting = async () => {
    if (!filePath) {
      ToastAndroid.show(
        'Você ainda não escolheu um arquivo!',
        ToastAndroid.SHORT,
      );
      return;
    }
    setLoading(true);
    setIsProcessStarted(true);
    await sliceVideo(
      filePath,
      status => {
        setProgressStatus(status.message);
      },
      14,
      selectedFormat,
      outputPath,
    );

    setLoading(false);
    setIsProcessStarted(false);
  };

  const callCancel = () => {
    ToastAndroid.show(cancel(), ToastAndroid.LONG);
    setLoading(false);
    setIsProcessStarted(false);
    setProgressStatus('');
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <Container>
            <Header>
              <Body>
                <Title>Cleaver para Stories</Title>
              </Body>
            </Header>
            <Grid>
              <Row>
                <Col style={styles.mainCol}>
                  <Row style={styles.topRow}>
                    <Col size={8}>
                      <Form>
                        <Item>
                          <Input
                            placeholder="Caminho do arquivo de vídeo"
                            value={filePath}
                          />
                        </Item>
                        <Item>
                          <Input
                            placeholder="Diretório de saída"
                            value={outputPath}
                            onChangeText={text => setOutputPath(text)}
                          />
                        </Item>
                        <Item>
                          <Input
                            placeholder="Diretório de saída"
                            value={outputPath}
                            onChangeText={text => setOutputPath(text)}
                          />
                        </Item>
                        <Text style={styles.formLabel}>Formato do vídeo</Text>
                        <Picker
                          mode="dropdown"
                          iosHeader="Select your SIM"
                          iosIcon={<Icon name="arrow-down" />}
                          style={{
                            width: Dimensions.get('screen').width,
                          }}
                          selectedValue={selectedFormat}
                          onValueChange={e => {
                            setSelectedFormat(e);
                          }}>
                          <Picker.Item label="MP4" value=".mp4" />
                          <Picker.Item label="AVI" value=".avi" />
                          <Picker.Item label="M4A" value=".m4a" />
                          <Picker.Item label="WMV" value=".wmv" />
                          <Picker.Item label="MOV" value=".mov" />
                          <Picker.Item label="FLV" value=".flv" />
                        </Picker>
                        <Text style={styles.formLabel}>
                          Tamanho final (em segundos)
                        </Text>
                        <Row>
                          <Col size={6}>
                            <Slider
                              style={{
                                width: Dimensions.get('screen').width / 2,
                                height: 40,
                              }}
                              minimumValue={1}
                              maximumValue={15}
                              step={1}
                              minimumTrackTintColor="#00796b"
                              maximumTrackTintColor="#000000"
                              onValueChange={secs => setSeconds(secs)}
                            />
                          </Col>
                          <Col size={6}>
                            <Text style={styles.seconds}>{seconds}s</Text>
                          </Col>
                        </Row>
                      </Form>
                    </Col>
                    <Col size={2}>
                      <Button
                        rounded
                        info
                        onPress={showFilePicker}
                        block
                        style={{marginTop: 6}}>
                        <Icon type="FontAwesome" name="search" />
                      </Button>
                      <Button
                        rounded
                        info
                        onPress={async () => {
                          setOutputPath(await Clipboard.getString());
                        }}
                        block
                        style={{marginTop: 10}}
                        warning
                        bordered>
                        <Icon type="FontAwesome" name="paste" />
                      </Button>
                    </Col>
                  </Row>
                  <Row style={styles.startStopButtonsRow}>
                    {isProcessStarted && (
                      <Col>
                        <Button
                          danger
                          bordered
                          block
                          onPress={callCancel}
                          style={styles.button}>
                          <Text>Cancelar</Text>
                        </Button>
                      </Col>
                    )}
                    <Col>
                      <Button
                        success
                        block
                        onPress={startCutting}
                        style={styles.button}>
                        <Text>Processar</Text>
                      </Button>
                    </Col>
                  </Row>
                  <Row style={styles.progressRow}>
                    <Col>
                      {loading && <Spinner color="green" />}
                      <Text style={styles.progressLabel}>{progressStatus}</Text>
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
  startStopButtonsRow: {marginTop: 260},
  seconds: {
    textAlign: 'center',
    marginTop: 7,
  },
});

export default Home;
