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
import {cutRepeatedly, cancel} from './src/utils/cuttingEngine';

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

  const processCutting = async () => {
    if (!filePath) {
      ToastAndroid.show(
        'Você ainda não escolheu um arquivo!',
        ToastAndroid.SHORT,
      );
      return;
    }
    await cutRepeatedly(filePath, status => console.log(status));

    ToastAndroid.show('O vídeo foi fatiado com sucesso!', ToastAndroid.LONG);
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
                    <Col>
                      <Button
                        danger
                        bordered
                        block
                        onPress={() => console.log(cancel())}
                        style={styles.button}>
                        <Text>Cancelar</Text>
                      </Button>
                    </Col>
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
    top: -200,
  },
  searchButton: {
    // top: 200,
  },
  mainCol: {
    backgroundColor: '#f5f5f5',
    height: Dimensions.get('screen').height,
    paddingHorizontal: 6,
  },
});

export default App;
