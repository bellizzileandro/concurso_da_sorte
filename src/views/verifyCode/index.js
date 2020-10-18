import React from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Alert,
    TextInput,
    ActivityIndicator,
    ToastAndroid
} from 'react-native'
import { Appbar } from 'react-native-paper'
import Container from '../layout'

import { userService } from '../../services/user'

import { globalStyles, COLORS } from '../../utils'
import AsyncStorage from '@react-native-community/async-storage'

function VerifyCode(props) {
    const { 
        navigation
    } = props

    const [code, setCode] = React.useState()
    const [loading, setLoading] = React.useState(false)

    const token = navigation.getParam('token', null)
    const cpf = navigation.getParam('cpf', null)

    const handleSubmit = () => {
        setLoading(true)
        console.log(token)
        userService.checkEmailCode(token)
            .then( response => {
                console.log(response)
                if(response.idstatus === '1') {
                    setLoading(false)
                    AsyncStorage.removeItem('tutorial')
                    navigation.navigate('ResetPassword', { cpf })
                } else {
                    setLoading(false)
                    ToastAndroid.show(response.dsstatus, ToastAndroid.LONG)
                }
            })
            .catch(error => {
                console.log('checkEmailCode error: ', error)
                setLoading(false)
                ToastAndroid.show('Desculpe, ocorreu um erro inesperado. Tente novamente.', ToastAndroid.LONG)
            })
    }

    const resendEmail = () => {
        setLoading(true)
        console.log(cpf)
        userService.checkCpf(cpf)
            .then( response => {
                if(response.idstatus === '1') {
                    setLoading(false)                        
                } else {
                    Alert.alert('Erro', response.dsstatus)
                    setLoading(false)
                }
            })
            .catch(error => {
                setLoading(false)
                console.log('error lostpassword: ', error)
                ToastAndroid.show('Desculpe ocorreu um erro inesperado. Tente novamente.', ToastAndroid.LONG)
            })
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
                    title='CONFIRMAR CÓDIGO'
                    titleStyle={[globalStyles.appTitle, globalStyles.centered]}
                    style={[globalStyles.centered]}
                />
                <Appbar.Action />
            </Appbar.Header>
            <KeyboardAvoidingView style={[styles.padding]}>
                <View style={[styles.container]}>
                    <View style={globalStyles.loadingContainer}>
                        <ActivityIndicator size='large' animating={loading}/>
                    </View>
                    <Text style={[styles.greenText, styles.container]}>
                        Estamos quase lá! Agora é só você digitar aqui o código que recebeu no seu e-mail.
                    </Text>
                    <View style={globalStyles.textInputContainer}>
                        <Text style={globalStyles.text}>Digite o código</Text>
                        <TextInput
                            placeholder='0000'
                            style={[globalStyles.textInput]}
                            onChange={ event => setCode(event.nativeEvent.text)}
                            value={code}
                            underlineColorAndroid={COLORS.lightColor}
                        />
                    </View>
                    <TouchableOpacity 
                        onPress={resendEmail}
                        style={globalStyles.butclearButtonton}
                    >
                        <Text style={globalStyles.clearButtonText}>Não recebi o código :(</Text>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity 
                    style={[globalStyles.button]}
                    onPress={handleSubmit}
                >
                    <Text style={globalStyles.textButton}>Avançar</Text>
                </TouchableOpacity>
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
    text: { 
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 10,
    },
})

export default VerifyCode
