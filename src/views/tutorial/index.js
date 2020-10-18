import React from 'react'
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions
} from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Swiper from 'react-native-swiper'
import { TouchableRipple } from 'react-native-paper'
import AsyncStorage from '@react-native-community/async-storage'

import { appActions } from '../../redux/actions'

const {width, height} = Dimensions.get('window')

function Tutorial(props) {

    const { navigation, setLoading } = props

    const [index, setIndex] = React.useState(0)

    const handleNext = () => {
        if(index === 3) {
            AsyncStorage.setItem('tutorial', '1')
            navigation.navigate('InsideApp')
            return
        }       
    }

    return (
        <View style={styles.container}>
            <Swiper 
                containerStyle={styles.wrapper}
                index={index}
                loop={false}
                onIndexChanged={ index => setIndex(index) }
                activeDotColor='#FFFFFF'
                automaticallyAdjustContentInsets
            >
                <View style={[styles.slideContainer]}>
                    {/* <Text style={styles.text}>Tela 1</Text> */}
                    <Image 
                        source={require('../../assets/images/Tutorial-Concurso.png')}
                        resizeMode='cover'
                        style={{ width: width, height: height }}
                    />
                </View>
                <View style={[styles.slideContainer]}>
                    {/* <Text style={styles.text}>Tela 2</Text> */}
                    <Image 
                        source={require('../../assets/images/Tutorial-Ganhadores.png')}
                        resizeMode='cover'
                        style={{ width: width, height: height }}
                    />
                </View>
                <View style={[styles.slideContainer]}>
                    {/* <Text style={styles.text}>Tela 3</Text> */}
                    <Image 
                        source={require('../../assets/images/Tutorial-Bilhetes.png')}
                        resizeMode='cover'
                        style={{ width: width, height: height }}
                    />
                </View>
                <View style={[styles.slideContainer]}>
                    {/* <Text style={styles.text}>Tela 4</Text> */}
                    <Image 
                        source={require('../../assets/images/Tutorial-Dados.png')}
                        resizeMode='cover'
                        style={{ width: width, height: height }}
                    />
                    <View style={styles.nextButtonContainer}>
                        <TouchableRipple
                            onPress={handleNext}
                            rippleColor="rgba(255, 255, 255, .32)"
                            style={styles.nextButton}
                            borderless={true}
                        >
                            <Text style={styles.textButton}>Próxima</Text>
                        </TouchableRipple>
                    </View>
                </View>
            </Swiper>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    wrapper: {},
    slideContainer: {
        flex: 1,
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
    nextButtonContainer: {
        position: 'absolute',
        bottom: 60,
        borderColor: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 30
    },
    nextButton: {
        borderRadius: 30
    },
    textButton: {
        color: '#FFFFFF',
        fontSize: 18,
        paddingVertical: 5,
        paddingHorizontal: 30
    },
})

const mapDispatchToProps = dispatch => bindActionCreators({
    setLoading: isLoading => appActions.loading(isLoading)
}, dispatch)

export default connect(null, mapDispatchToProps)(Tutorial)
