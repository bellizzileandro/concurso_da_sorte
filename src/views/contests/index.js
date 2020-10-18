import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback,
    Image,
    ActivityIndicator
} from 'react-native'
import { NavigationEvents } from 'react-navigation'
import { Appbar } from 'react-native-paper'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux' 
import Swiper from 'react-native-swiper'
import AsyncStorage from '@react-native-community/async-storage'
import { globalStyles } from '../../utils'

import { contestActions } from '../../redux/actions'
import { userService } from '../../services/user'

const { width, height } = Dimensions.get('window')

function Contests(props) {

    const { 
        navigation, 
        getAll,
        contests,
        loading
    } = props

    const [index, setIndex] = React.useState(0)

    function init() {
        getAll()
        userService.refreshToken()
            .then( response => {
                console.log('refreshToken response: ', response)
                if(response.idstatus === '1') {
                    AsyncStorage.removeItem('token')
                    AsyncStorage.setItem('token', response.token)
                }
            })
    }

    /**
     * Envia de forma as informações do item clicado e o token do usuário para o webview
     */
    const handleBuy = async item => {
        // Declarado como constante e utilizado await para evitar o uso de Promise
        const token = await AsyncStorage.getItem('token')
        navigation.navigate('BuyTicket', { item: item, token: token })
    }

    const elements = !!contests.elementos ? contests.elementos : []

    return (
        <>
            <NavigationEvents 
                onDidFocus={ payload => init() }
            /> 
            <Appbar.Header
                style={[globalStyles.appbar, styles.topBar]}
            >
                <Image 
                    source={require('../../assets/images/logo-topo.png')}
                    resizeMode='contain'
                />
            </Appbar.Header>
            <View style={styles.container}>
                <View style={globalStyles.loadingContainer}>
                    <ActivityIndicator size='large' animating={loading}/>
                </View>
                <Swiper
                    containerStyle={styles.wrapper}
                    index={index}
                    onIndexChanged={ index => setIndex(index) }
                    activeDotColor='#FFFFFF'
                    automaticallyAdjustContentInsets
                >
                {elements.map((item, key) => (
                    <TouchableWithoutFeedback 
                        style={[styles.slideContainer]} 
                        key={key}
                        onPress={() => handleBuy(item)}
                    >
                        <Image 
                            source={{ uri: item.rdspathimage }}
                            resizeMode='cover'
                            style={{ flex: 1, width: width, height: height }}
                        />
                    </TouchableWithoutFeedback>
                ))}
                </Swiper>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    topBar: {
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flexGrow: 1,
    },
    wrapper: {},
    slideContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    slide1: {
        backgroundColor: '#9DD6EB'
    },
    slide2: {
        backgroundColor: '#97CAE5'
    },
    slide3: {
        backgroundColor: '#92BBD9'
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold'
    },
})

const mapStateToProps = state => ({
    contests: state.contestState.contests,
    loading: state.contestState.isLoading
})

const mapDispatchToProps = dispatch => bindActionCreators({
    getAll: () => contestActions.getAll(),
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Contests)
