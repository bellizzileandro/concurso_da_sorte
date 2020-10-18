import AsyncStorage from '@react-native-community/async-storage'

export const getStorageDataAsync = async (key) => {
    try {
        await AsyncStorage.getItem(key).then( val => {
            // console.log(`val from ${key}: `, val)
            return val
        })
    } catch (error) {
        // console.log('error: ', error)
    }
}

export async function storeDataAsync(data, key) {
    try {
        await AsyncStorage.setItem(key, data)
    } catch (error) {
        // console.log('storeDataAsync error: ', error)
    }
}
