/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {useState, useEffect} from 'react';
import styles from './styles';
import {
  SafeAreaView,
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
  Content,
} from 'native-base';
import {Col, Row, Grid} from 'react-native-easy-grid';
import FilePicker from 'react-native-file-picker';
import {sliceVideo, cancel} from '../../services/cuttingEngine';
import {saveSettings, loadSetting} from '../../services/settings';

// video path storage/emulated/0/Download/video.mp4

const Home: () => React$Node = () => {
  const [filePath, setFilePath] = useState('');
  const [outputPath, setOutputPath] = useState('');
  const [progressStatus, setProgressStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [isProcessStarted, setIsProcessStarted] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('.mp4');
  const [seconds, setSeconds] = useState(15);

  const loadSettings = async () => {
    const filePathSaved = await loadSetting('filePath');
    const outputPathSaved = await loadSetting('outputPath');
    const selectedFormatSaved = await loadSetting('selectedFormat');
    const secondsSaved = await loadSetting('seconds');
    setFilePath(filePathSaved || '');
    setOutputPath(outputPathSaved || '');
    setSeconds(secondsSaved || 15);
    if (selectedFormatSaved) {
      setSelectedFormat(selectedFormatSaved);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

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

  const saveCurrentSettings = () => {
    saveSettings({
      filePath,
      outputPath,
      selectedFormat,
      seconds,
    });
  };

  const startCutting = async () => {
    saveCurrentSettings();
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
      seconds,
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
            <Content>
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
                              placeholder="Diretório de saída (opcional)"
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
                            Tamanho dos vídeos
                          </Text>
                          <Row>
                            <Col size={6}>
                              <Slider
                                style={styles.slider}
                                minimumValue={1}
                                maximumValue={15}
                                step={1}
                                minimumTrackTintColor="#00796b"
                                maximumTrackTintColor="#000000"
                                onValueChange={secs => setSeconds(secs)}
                                value={parseFloat(seconds)}
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
                          light
                          onPress={async () => {
                            setOutputPath(await Clipboard.getString());
                          }}
                          block
                          style={{marginTop: 10}}
                          rounded>
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
                          <Text>Iniciar</Text>
                        </Button>
                      </Col>
                    </Row>
                    <Row style={styles.progressRow}>
                      <Col>
                        {loading && <Spinner color="green" />}
                        <Text style={styles.progressLabel}>
                          {progressStatus}
                        </Text>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Grid>
            </Content>
          </Container>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Home;