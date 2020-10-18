import React from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    ActivityIndicator,
    Alert
} from 'react-native'
import { Appbar, HelperText } from 'react-native-paper'
import TextInputMask from 'react-native-text-input-mask'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Container from '../layout'

import { createUserActions } from '../../redux/actions'
import { createUserService } from '../../services/createUser'

import { globalStyles, COLORS } from '../../utils'

function UserConfirmation(props) {
    const { 
        navigation, 
        sendSms, 
        confirSmsCode,
        storeSmsCode,
        smsStatus,
    } = props

    const [code, setCode] = React.useState()
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState()

    const cell = navigation.getParam('cell', null)

    const handleSubmit = () => {
        setLoading(true)
        if(code != null && code != undefined && code.length === 4) {
            confirSmsCode(code, cell)
            createUserService.sendSmsCode(code, cell)
                .then( response => {
                    if (response.idstatus === '1') {
                        setLoading(false)
                        storeSmsCode(code)
                        navigation.navigate('CardRegister')
                    } else {
                        setLoading(false)
                        Alert.alert('Código errado.', smsStatus.idstatus)
                    }
                })
                .catch( error => {
                    setLoading(false)
                    Alert.alert('Erro inesperado', error)
                })
        } else {
            setError('Código deve ser preenchido.')
        }
    }

    const resendSms = () => {
        sendSms(cell)
    }

    return (
        <Container>
            <Appbar.Header
                style={globalStyles.appbar}
            >
                <Appbar.BackAction 
                    onPress={() => navigation.goBack()}
                />
                <Appbar.Content 
                    title='ENTRAR'
                    titleStyle={[globalStyles.appTitle, globalStyles.centered]}
                    style={[globalStyles.centered]}
                />
                <Appbar.Action />
            </Appbar.Header>
            <KeyboardAvoidingView style={[styles.padding]}>
                <View style={[styles.container]}>
                    <Text style={[styles.greenText, styles.container]}>
                        Estamos quase lá! Agora precisamos que informe seu código de 4 dígitos
                        que enviamos para seu telefone, ok?
                        Isso é só para garantir a sua segurança.
                    </Text>
                    <View style={globalStyles.textInputContainer}>
                        <Text style={globalStyles.text}>Digite o código SMS de 4 dígitos</Text>
                        <TextInputMask 
                            keyboardType='number-pad'
                            style={[globalStyles.textInput]}
                            onChangeText={text => setCode(text)}
                            value={code}
                            mask={'[0000]'}
                            underlineColorAndroid={COLORS.lightColor}
                        />
                    </View>
                    <HelperText
                            type='error'
                            visible={!!error}
                        >
                            {error}
                    </HelperText>
                    <TouchableOpacity 
                        onPress={resendSms}
                        style={globalStyles.butclearButtonton}
                    >
                        <Text style={globalStyles.clearButtonText}>Ops. não recebi o código</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity 
                    style={[globalStyles.button]}
                    onPress={handleSubmit}
                >
                    <Text style={globalStyles.textButton}>Avançar</Text>
                </TouchableOpacity>
                <View style={globalStyles.loadingContainer}>
                    <ActivityIndicator size='large' animating={loading}/>
                </View>
            </KeyboardAvoidingView>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    padding: {
        padding: 20,
    },
    greenText: {
        color: COLORS.primaryColor,
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 10,
    },
})

const mapStateToProps = state => ({
    smsStatus: state.createUserState.smsStatus
})

const mapDispatchToProps = dispatch => bindActionCreators({
    sendSms: cell => createUserActions.sendSms(cell),
    confirSmsCode: (code, cell) => createUserActions.confirmSmsCode(code, cell),
    storeSmsCode: code => createUserActions.storeSms(code)
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(UserConfirmation)
