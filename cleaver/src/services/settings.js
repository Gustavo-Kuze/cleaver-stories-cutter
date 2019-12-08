import AsyncStorage from '@react-native-community/async-storage';

const saveSettings = async settings => {
  try {
    Object.entries(settings).map(async ([key, value]) => {
      await AsyncStorage.setItem(key, `${value}`);
    });
  } catch (e) {
    console.log('erro ao tentar salvar as configurações');
    console.log(e);
  }
};

const loadSetting = async key => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    console.log('erro ao tentar carregar o valor');
    console.log(e);
  }
};

export {saveSettings, loadSetting};
