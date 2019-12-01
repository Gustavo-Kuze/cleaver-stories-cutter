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
} from 'native-base';
import {Col, Row, Grid} from 'react-native-easy-grid';

const App: () => React$Node = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <Container>
            <Header />
            <Grid>
              <Row>
                <Col
                  style={{
                    backgroundColor: '#f5f5f5',
                    height: Dimensions.get('screen').height,
                  }}>
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
                        onPress={() => console.log('teste')}
                        style={styles.button}>
                        <Icon type="FontAwesome" name="search" />
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
});

export default App;
