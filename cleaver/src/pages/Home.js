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
  Spinner,
} from 'native-base';
import {Col, Row, Grid} from 'react-native-easy-grid';

import FilePicker from 'react-native-file-picker';
import {cutRepeatedly, cancel} from '../utils/cuttingEngine';

// video path storage/emulated/0/Download/video.mp4

const Home: () => React$Node = () => {
  const [filePath, setFilePath] = useState('');
  const [progressStatus, setProgressStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [isProcessStarted, setIsProcessStarted] = useState(false);

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

  const processCutting = async () => {
    if (!filePath) {
      ToastAndroid.show(
        'Você ainda não escolheu um arquivo!',
        ToastAndroid.SHORT,
      );
      return;
    }
    setLoading(true);
    setIsProcessStarted(true);
    await cutRepeatedly(filePath, status => {
      setProgressStatus(status.message);
    });

    setLoading(false);
    ToastAndroid.show('O vídeo foi fatiado com sucesso!', ToastAndroid.LONG);
    callCancel();
  };

  const callCancel = () => {
    setLoading(false);
    setIsProcessStarted(false);
    setProgressStatus('');
    cancel();
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <Container>
            <Header>
              <Body>
                <Title>Cleaver para Instagram</Title>
              </Body>
            </Header>
            <Grid>
              <Row>
                <Col style={styles.mainCol}>
                  <Row style={{marginTop: 50}}>
                    <Col size={8}>
                      <Form>
                        <Item>
                          <Input
                            placeholder="Caminho do arquivo de vídeo"
                            value={filePath}
                          />
                        </Item>
                      </Form>
                    </Col>
                    <Col size={2} style={styles.searchButton}>
                      <Button
                        rounded
                        info
                        onPress={showFilePicker}
                        block
                        style={styles.searchButton}>
                        <Icon type="FontAwesome" name="search" />
                      </Button>
                    </Col>
                  </Row>
                  <Row>
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
                        onPress={processCutting}
                        style={styles.button}>
                        <Text>Processar</Text>
                      </Button>
                    </Col>
                  </Row>
                  <Row style={styles.progressRow}>
                    <Col>
                      {loading && <Spinner color="green" />}
                      {isProcessStarted && (
                        <Text style={styles.progressLabel}>
                          {progressStatus}
                        </Text>
                      )}
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
    top: -90,
  },
  searchButton: {
    // top: 200,
  },
  mainCol: {
    backgroundColor: '#f5f5f5',
    height: Dimensions.get('screen').height,
    paddingHorizontal: 6,
  },
  progressRow: {
    top: -150,
  },
  progressLabel: {
    textAlign: 'center',
  },
});

export default Home;
