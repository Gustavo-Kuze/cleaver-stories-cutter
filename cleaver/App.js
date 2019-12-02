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
import {cut, cancel} from './src/utils/cuttingEngine';

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
    cut(
      filePath,
      '00',
      '15',
      status => console.log(status.size),
      () => console.log('ACABOU!!'),
    );
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
                        onPress={() => console.log(cancel())}
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
    top: -200,
  },
  searchButton: {
    top: 200,
  },
  mainCol: {
    backgroundColor: '#f5f5f5',
    height: Dimensions.get('screen').height,
  },
});

export default App;
