/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
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
  Left,
  Right,
  Title,
} from 'native-base';
import {Col, Row, Grid} from 'react-native-easy-grid';

const App: () => React$Node = () => {
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
                          />
                        </Item>
                      </Form>
                    </Col>
                    <Col size={4} style={styles.searchButton}>
                      <Button
                        rounded
                        info
                        onPress={() => {
                          ToastAndroid.show(
                            'Apenas um teste',
                            ToastAndroid.SHORT,
                          );
                        }}
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
