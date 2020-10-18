import React from 'react'
import {
    SafeAreaView,
    View,
    ScrollView,
    Text,
    StatusBar,
    TouchableOpacity,
    StyleSheet,
    ToastAndroid,
    Alert,
    ActivityIndicator
} from 'react-native'
import { Appbar } from 'react-native-paper'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import TextInputMask from 'react-native-text-input-mask'
import { unformatCpf } from '../../utils/helpers'
import Icon from 'react-native-vector-icons/Ionicons'

import { 
    globalStyles,
    COLORS,
    validation
} from '../../utils'
import { lostActions } from '../../redux/actions'
import { userService } from '../../services/user'

function LostPassword(props) {

    const { navigation } = props
    
    const [cpf, setCpf] = React.useState()
    const [loading, setLoading] = React.useState(false)


    const handleChange = property => e => {
        setCpf(e.nativeEvent.text)
    }

    const handleSubmit = () => {
        setLoading(true)
        if(validation.cpf(cpf)) {
            var _cpf = unformatCpf(cpf)
            userService.checkCpf(_cpf)
                .then( response => {
                    if(response.idstatus === '1') {
                        setLoading(false)
                        navigation.navigate('VerifyEmail', { token: response.token, emailMask: response.dsEmail, cpf: _cpf })                        
                    } else {
                        ToastAndroid.show(response.dsstatus, ToastAndroid.LONG)
                        setLoading(false)
                    }
                })
                .catch(error => {
                    setLoading(false)
                    console.log('error lostpassword: ', error)
                    ToastAndroid.show('Desculpe ocorreu um erro inesperado. Tente novamente.', ToastAndroid.LONG)
                })
        } else {
            ToastAndroid.show('Informe um CPF válido.', ToastAndroid.LONG)
            setLoading(false)
        }
    }

    return (
        <>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={globalStyles.container}>
                <Appbar.Header
                    style={globalStyles.appbar}
                >
                    <Appbar.BackAction 
                        onPress={() => navigation.goBack()}
                    />
                    <Appbar.Content 
                        title='RECUPERAR CONTA'
                        titleStyle={[globalStyles.appTitle, globalStyles.centered]}
                        style={[globalStyles.centered]}
                    />
                    <Appbar.Action />
                </Appbar.Header>
                <ScrollView
                    contentInsetAdjustmentBehavior="automatic"
                    style={styles.scrollView}
                    contentContainerStyle={styles.content}
                >
                    <View style={globalStyles.loadingContainer}>
                        <ActivityIndicator size='large' animating={loading}/>
                    </View>
                    <View style={{ borderBottomColor: COLORS.lightColor }}>
                        <Text style={styles.text}>CPF</Text>
                        <TextInputMask 
                            placeholder='999.999.999-99'
                            keyboardType='number-pad'
                            style={[globalStyles.textInput, styles.celInput]}
                            mask={'[000].[000].[000]-[00]'}
                            value={cpf}
                            onChange={handleChange('cpf')}
                            underlineColorAndroid={COLORS.lightColor}
                        />
                    </View>
                    <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 10 }}>
                        <Icon name='ios-search' size={30} color='#000000' />
                        <View>
                            <Text style={{ fontWeight: 'bold', flexWrap: 'wrap' }}>
                                Opa! Parece que você está com dificuldades para acessar sua conta. Vamos te ajudar!
                            </Text>
                            <Text style={{ color: 'gray', marginTop: 5 }}>
                                Insira seu CPF para encontrarmos o seu e-mail.
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        <Text style={styles.textButton}>BUSCAR</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 1,
    },
    content: {
        flexGrow: 1,
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'flex-start',
        padding: 20,
    },
    logoContainer: {
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
        marginBottom: 25,
    },
    text: {
        color: COLORS.lightColor,
    },
    textInput: {
        flex: 1,
        color: COLORS.lightColor,
    },
    textButton: {
        color: '#FFFFFF',
        textTransform: 'uppercase',
        fontWeight: 'bold'
    },
    button: {
        alignItems: 'center',
        backgroundColor: COLORS.primaryColor,
        borderRadius: 5,
        marginVertical: 15,
        padding: 10,
    },
    clearButton: {
        alignItems: 'flex-start',
        textDecorationStyle: 'solid',
        textDecorationLine: 'underline',
        textDecorationColor: COLORS.secondColor,
    },
    clearButtonText: {
        color: COLORS.secondColor,
        textDecorationStyle: 'solid',
        textDecorationLine: 'underline',
        textDecorationColor: COLORS.secondColor,
    },
})

const mapStateToProps = state => ({
    isLoading: state.loginState.isLoading
})

const mapDispatchToProps = dispatch => bindActionCreators({
    recovery: cpf => lostActions.recovery(cpf)
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(LostPassword)
