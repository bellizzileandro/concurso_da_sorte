import React from 'react'
import {
    View,
    ActivityIndicator,
    StyleSheet
} from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'
import { getStorageDataAsync } from '../../utils'


function AppSwitcher(props) {

    const { 
        navigation,
    } = props

    React.useEffect(() => {
        _bootstrapAsync()
    }, [])

    const _bootstrapAsync = async () => {
        const _tutorial = await AsyncStorage.getItem('tutorial')
        if (_tutorial === '1') {
            navigation.navigate('InsideApp')
            return
        } else {
            navigation.navigate('Tutorial')
        }
           
        
    }

    return (
        <View style={styles.container}>
            <ActivityIndicator
                style={styles.activityIndicator}
                size="large" 
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activityIndicator: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
})

export default AppSwitcher
