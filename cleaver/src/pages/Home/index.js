/* eslint-disable curly */
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
  Content,
  CheckBox,
} from 'native-base';
import {Col, Row, Grid} from 'react-native-easy-grid';
import {sliceVideo, cancel} from '../../services/cuttingEngine';
import {saveSettings, loadSetting} from '../../services/settings';
import VideoFormatsPicker from '../../components/VideoFormatsPicker';
import {showFilePicker} from '../../utils/fs';
import FileSystem from 'react-native-fs';
import {toast} from '../../utils/sysUtils';
import {Splash} from '../Splash';

const Home = () => {
  const [filePath, setFilePath] = useState('');
  const [outputPath, setOutputPath] = useState('');
  const [progressStatus, setProgressStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [isProcessStarted, setIsProcessStarted] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('.mp4');
  const [seconds, setSeconds] = useState(15);
  const [hideSplash, setHideSplash] = useState(false);
  const [quickCut, setquickCut] = useState(false);

  const loadSettings = async () => {
    const outputPathSaved = await loadSetting('outputPath');
    const selectedFormatSaved = await loadSetting('selectedFormat');
    const secondsSaved = await loadSetting('seconds');
    const quickCutSaved = await loadSetting('quickCut');
    setOutputPath(outputPathSaved || '');
    setSeconds(secondsSaved || 15);
    if (selectedFormatSaved) {
      setSelectedFormat(selectedFormatSaved);
    }
    setquickCut(quickCutSaved && quickCutSaved !== 'false');
  };

  useEffect(() => {
    setTimeout(() => {
      loadSettings();
      setTimeout(() => {
        setHideSplash(true);
      }, 40);
    }, 1000);
  }, []);

  const selectFile = async () => {
    const path = await showFilePicker();
    if (path) setFilePath(path);
  };

  const setStart = () => {
    saveSettings({
      outputPath,
      selectedFormat,
      seconds,
      quickCut,
    });
    setLoading(true);
    setIsProcessStarted(true);
  };

  const setStop = () => {
    setLoading(false);
    setIsProcessStarted(false);
  };

  const startCutting = async () => {
    if (!filePath) {
      return toast('Você ainda não escolheu um arquivo!');
    }
    if (outputPath) {
      const directoryExists = await FileSystem.exists(outputPath);
      if (!directoryExists) {
        return toast(
          'O diretório de saída escolhido não existe! Crie a pasta antes de prosseguir.',
        );
      }
    }

    setStart();

    await sliceVideo(
      filePath,
      status => {
        setProgressStatus(status.message);
      },
      seconds,
      selectedFormat,
      outputPath,
      quickCut,
    );

    setStop();
  };

  const callCancel = () => {
    ToastAndroid.show(cancel(), ToastAndroid.LONG);
    setStop();
    setProgressStatus('');
  };

  return (
    <>
      {!hideSplash && <Splash />}
      {hideSplash && (
        <>
          <StatusBar hidden />
          <SafeAreaView>
            <ScrollView contentInsetAdjustmentBehavior="automatic">
              <Container>
                <Header style={styles.header}>
                  <Body>
                    <Title style={styles.title}>Cleaver para Stories</Title>
                  </Body>
                </Header>
                <Content>
                  <Grid>
                    <Row>
                      <Col style={styles.mainCol}>
                        <Row style={styles.topRow}>
                          <Col size={8}>
                            <Form>
                              <Item style={styles.inputItem}>
                                <Input
                                  placeholder="Caminho do arquivo de vídeo"
                                  value={filePath}
                                  style={styles.input}
                                />
                              </Item>
                              <Item style={styles.inputItem}>
                                <Input
                                  placeholder="Diretório de saída (opcional)"
                                  value={outputPath}
                                  onChangeText={text => setOutputPath(text)}
                                  style={styles.input}
                                />
                              </Item>
                              <Row style={styles.chkquickCut}>
                                <Col size={2}>
                                  <CheckBox
                                    checked={quickCut}
                                    onPress={() => {
                                      setquickCut(!quickCut);
                                    }}
                                  />
                                </Col>
                                <Col size={10}>
                                  <Text
                                    onPress={() => {
                                      setquickCut(!quickCut);
                                    }}>
                                    Corte rápido
                                  </Text>
                                </Col>
                              </Row>
                              <Text style={styles.formLabel}>
                                Formato do vídeo
                              </Text>

                              <VideoFormatsPicker
                                onValueChange={format =>
                                  setSelectedFormat(format)
                                }
                                selectedFormat={selectedFormat}
                              />
                              <Text style={styles.formLabel}>
                                Tamanho dos vídeos
                              </Text>
                              <Row>
                                <Col size={12}>
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
                              </Row>
                              <Row>
                                <Col size={12}>
                                  <Text style={styles.seconds}>{seconds}s</Text>
                                </Col>
                              </Row>
                            </Form>
                          </Col>
                          <Col size={2} style={styles.formButtonsCol}>
                            <Button
                              rounded
                              info
                              onPress={selectFile}
                              block
                              style={styles.searchButton}>
                              <Icon type="FontAwesome" name="search" />
                            </Button>
                            <Button
                              light
                              onPress={async () => {
                                setOutputPath(await Clipboard.getString());
                              }}
                              block
                              style={styles.pasteButton}
                              rounded>
                              <Icon type="FontAwesome" name="paste" />
                            </Button>
                          </Col>
                        </Row>
                        <Row style={styles.startStopButtonsRow}>
                          {!!isProcessStarted && (
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
                          {!isProcessStarted && (
                            <Col>
                              <Button
                                success
                                block
                                onPress={startCutting}
                                style={styles.button}>
                                <Text>Iniciar</Text>
                              </Button>
                            </Col>
                          )}
                        </Row>
                        <Row style={styles.progressRow}>
                          <Col>
                            {loading && (
                              <Spinner color="green" style={styles.loader} />
                            )}
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
      )}
    </>
  );
};

export default Home;
