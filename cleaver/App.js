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

const App: () => React$Node = () => {
  const [filePath, setFilePath] = useState('');

  const showFilePicker = () => {
    FilePicker.showFilePicker(null, response => {
      setFilePath(response.path);
      ToastAndroid.show(response.path, ToastAndroid.SHORT);

      if (response.didCancel) {
        ToastAndroid.show('Cancelado', ToastAndroid.SHORT);
      } else if (response.error) {
        ToastAndroid.show(response.error, ToastAndroid.LONG);
      } else {
        // aqui da pra setar no state qual arquivo foi escolhido
      }
    });
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
                            disabled
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
                        large
                        success
                        onPress={() => {
                          ToastAndroid.show(
                            'Botão "Processar" foi clicado',
                            ToastAndroid.SHORT,
                          );
                        }}
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
  },
  searchButton: {
    height: 300,
  },
  mainCol: {
    backgroundColor: '#f5f5f5',
    height: Dimensions.get('screen').height,
  },
});

export default App;
