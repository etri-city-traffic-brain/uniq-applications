import AsyncStorage from '@react-native-async-storage/async-storage';

async function storeData(value) {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem('@storage_Key', jsonValue);
  } catch (err) {
    console.log(err);
  }
}

async function getData() {
  console.log('getData');
  try {
    const jsonValue = await AsyncStorage.getItem('@storage_Key');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (err) {
    console.log(err);
  }
}

export default {
  storeData,
  getData,
};
