import React from 'react'
import {
    ScrollView,
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Linking,
    ActivityIndicator
} from 'react-native'
import { HelperText, Appbar } from 'react-native-paper'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Icon from 'react-native-vector-icons/Ionicons'
import Container from '../layout'

import { 
    globalStyles,
    COLORS,
    validation
} from '../../utils'

import { loginService } from '../../services/login'
import AsyncStorage from '@react-native-community/async-storage'
import { contestService } from '../../services/contest'
import TextInputMask from 'react-native-text-input-mask'

function Login(props) {
    const { 
        navigation, 
    } = props

    const [values, setValues] = React.useState({})
    const [pswType, setPswType] = React.useState(true)
    const [errors, setErrors] = React.useState({})
    const [loading, setLoading] = React.useState(false)

    const handleChange = property => e => {
        setValues({
            ...values,
            [property]: e.nativeEvent.text
        })
    }

    /**
     * Valida os dados de email para exibir ao usuário.
     */
    function validateEmail() {
        // console.log(validation.cpf(values.cpf))
        if(!validation.email(values.email)) {
            setErrors({
                ...errors,
                email: 1,
                emailText: 'Entre com um e-mail válido.'
            })
            return
        } else {
            setErrors({
                ...errors,
                email: 0,
                emailText: ''
            })
        }
    }

    function submitValidate(data) {
        // console.log(data)
        if(data.email === 1) {
            setErrors({
                ...errors,
                email: 1,
                emailText: 'Entre com um e-mail válido.'
            })
            return false
        } else {
            setErrors({
                ...errors,
                email: 0,
                emailText: ''
            })
        }
        if(data.password != 0) {
            setErrors({
                ...errors,
                password: 1,
                passwordText: 'Senha deve ser preenchida corretamente.'
            })
            return false
        } else {
            setErrors({
                ...errors,
                password: 0,
                passwordText: ''
            })
        }
        return true
    }

    const handleSubmit = () => {
        if(submitValidate(errors)) {
            setLoading(true)
            loginService.signin(values)
                .then( response => {
                    if (response.idstatus === '1') {
                        var _user = {
                            cdemissora: response.cdemissora,
                            token: response.token, 
                            email: response.dsEmail, 
                            password: values.password
                        }
                        loginService.getUserDataByToken(_user)
                            .then( resp => {
                                if(resp.idstatus === '1') {
                                    setLoading(false)
                                    var user = {
                                        nmcliente: resp.nmcliente,
                                        idstatus: resp.idstatus,
                                        cdemissora: resp.cdemissora,
                                        nmemissora: resp.nmemissora,
                                        restricao: resp.restricao,
                                        cdcliente: resp.cdcliente,
                                        dsemail: resp.dsEmail,
                                        nrCelular: resp.nrCelular,
                                        termoaceito: resp.termoaceito,
                                        customerid: resp.customerid,
                                        dtnascimento: resp.dtnascimento,
                                        cpf: resp.cpf
                                    }
                                    AsyncStorage.setItem('userData', JSON.stringify(user))
                                    AsyncStorage.setItem('token', response.token)
                                    AsyncStorage.setItem('password', values.password)
                                    navigation.navigate('App')
                                } else {
                                    setLoading(false)
                                    Alert.alert(
                                        'Erro no login',
                                        resp.dsstatus
                                    )
                                }
                            })
                        
                    } else {
                        setLoading(false)
                        Alert.alert(
                            'Erro no login',
                            response.dsstatus
                        )
                    }
                })
                .catch( error => {
                    setLoading(false)
                    Alert.alert(
                        'Erro inesperado',
                        error
                    )
                })
        }
        setLoading(false)
    }

    const handleLostPasswordClick = () => {
        navigation.navigate('LostPassword')
    }

    const handleCreateAccountClick = () => {
        navigation.navigate('CreateAccount')
    }

    const handlePress = () => {
        setPswType(!pswType)
    }

    function validatePassword() {
        if(values.password === null || values.password.length < 8) {
            setErrors({
                ...errors,
                password: 1,
                passwordText: 'A senha deve conter no mínimo 8 caracteres.'
            })
        } else {
            setErrors({
                ...errors,
                password: 0,
                passwordText: ''
            })
        }
    }

    return (
        <Container>
            <Appbar.Header
                style={globalStyles.appbar}
            >
                <Appbar.Action />
                <Appbar.Content 
                    title='ENTRAR'
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
                <View style={globalStyles.textInputContainer}>
                    <Text style={styles.text}>E-mail</Text>
                    <TextInput 
                        autoCapitalize="none"
                        placeholder='email@email.com'
                        style={styles.textInput}
                        value={values.cpf}
                        onChange={handleChange('email')}
                        onEndEditing={() => validateEmail()}
                        keyboardType='email-address'
                        underlineColorAndroid={COLORS.lightColor}
                    />
                    <HelperText
                        type='error'
                        visible={errors.email === 1}
                    >
                        {errors.emailText}
                    </HelperText>
                </View>
                <View style={globalStyles.textInputContainer}>
                    <Text style={styles.text}>Senha</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                        <TextInput 
                            style={styles.textInput}
                            textContentType='password'
                            value={values.password}
                            onChange={handleChange('password')}
                            secureTextEntry={pswType}
                            onEndEditing={() => validatePassword()}
                            underlineColorAndroid={COLORS.lightColor}
                        />
                        <TouchableOpacity
                            onPress={handlePress}
                            style={styles.showPswStyle}
                        >
                            <Icon name={pswType ? 'md-eye' : 'md-eye-off'} size={30} color={COLORS.lightColor} />
                        </TouchableOpacity>
                    </View>
                    <HelperText
                        type='error'
                        visible={errors.password === 1}
                    >
                        {errors.passwordText}
                    </HelperText>
                </View>
                <TouchableOpacity 
                    style={{...styles.clearButton, ...{marginBottom: 10}}}
                    onPress={handleLostPasswordClick}
                >
                    <Text style={[styles.text, styles.clearButtonText]}>Esqueci minha senha/e-mail</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    <Text style={styles.textButton}>Entrar</Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ marginRight: 10 }}>Ainda não tem conta?</Text>
                    <TouchableOpacity 
                        style={styles.clearButton}
                        onPress={handleCreateAccountClick}
                    >
                        <Text style={[styles.text, styles.clearButtonText]}>CADASTRE-SE</Text>
                    </TouchableOpacity>
                </View>
                
            </ScrollView>
        </Container>
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
    showPswStyle: {
        position: 'absolute',
        right: 15
    },
})

const mapStateToProps = state => ({
    isLoading: state.loginState.isLoading
})

const mapDispatchToProps = dispatch => bindActionCreators({
    login: user => loginActions.signin(user),
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Login)
