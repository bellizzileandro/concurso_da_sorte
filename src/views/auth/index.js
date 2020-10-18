import React from 'react'
import {
    View,
    ActivityIndicator,
    StyleSheet,
    PermissionsAndroid,
    Platform
} from 'react-native'
import { NavigationEvents } from 'react-native'
import Geolocation from '@react-native-community/geolocation'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import SplashScreen from 'react-native-splash-screen'
import AsyncStorage from '@react-native-community/async-storage'
import { createUserActions, contestActions } from '../../redux/actions'

function Authenticate(props) {

    const { 
        navigation,
        getCountries,
        getAllContests
    } = props
    
    React.useEffect(() => {
        getAllContests()
        getCountries()
        _bootstrapAsync()
        SplashScreen.hide()
    }, [])

    const _bootstrapAsync = async () => {
        const user = await AsyncStorage.getItem('userData')
        navigation.navigate(user ? 'App' : 'Auth')
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

const mapStateToProps = state => ({

})

const mapDispatchToProps = dispatch => bindActionCreators({
    getCountries: () => createUserActions.getCountries(),
    getAllContests: () => contestActions.getAll(),
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Authenticate)
