import React from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Alert,
    TextInput,
} from 'react-native'
import { TouchableRipple, HelperText } from 'react-native-paper'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { NavigationEvents } from 'react-navigation'
import Icon from 'react-native-vector-icons/Ionicons'

import Container from '../layout'
import { globalStyles, COLORS, validation } from '../../utils'
import AsyncStorage from '@react-native-community/async-storage'

import { userActions } from '../../redux/actions/user'
import { userService } from '../../services/user'

function ChangePassword(props) {
    const { 
        navigation, 
        user,
        storeUser
    } = props

    var [values, setValues] = React.useState({})
    var [errors, setErrors] = React.useState({})
    var [loading, setLoading] = React.useState(false)

    function validatePassword(value) {
        var _r = true
        if(!validation.password(value)) {
            setErrors({
                ...errors,
                password: 1,
                passwordText: 'A senha deve conter no mínimo 6 caracteres, entre letras, números e  caracteres especiais.'
            })
            _r = false
        } else {
            setErrors({
                ...errors,
                password: 0,
                passwordText: ''
            })
            _r = true
        }
        return _r
    }

    function validateConfirmPassword(value) {
        var _r = true
        if(value != values.newPassword) {
            setErrors({
                ...errors,
                confirmPassword: 1,
                confirmPasswordText: 'Deve ser igual à nova senha.'
            })
            _r = false
        } else {
            setErrors({
                ...errors,
                confirmPassword: 0,
                confirmPasswordText: ''
            })
            _r = true
        }
        
        return _r
    }

    function validatePassword(text) {
        if(text === null) {
            setErrors({
                ...errors, 
                password: 1,
                passwordText: 'Senha deve ser preenchida.'
            })
            return
        } else if(text.length < 6) {
            setErrors({
                ...errors, 
                password: 1,
                passwordText: 'Entre com uma senha de no mínimo 6 caracteres válida.'
            })
            return
        } else {
            setErrors({
                ...errors, 
                password: 0,
                passwordText: ''
            })
        }
    }

    function validateConfirmPassword(text) {
        if(text === null) {
            setErrors({
                ...errors, 
                confirmPassword: 1,
                confirmPasswordText: 'Senha deve ser preenchida.'
            })
            return
        } else if(text.length < 6) {
            setErrors({
                ...errors, 
                confirmPassword: 1,
                confirmPasswordText: 'Entre com uma senha de no mínimo 6 caracteres válida.'
            })
            return
        } else if(text != values.newPassword) {
            setErrors({
                ...errors, 
                confirmPassword: 1,
                confirmPasswordText: 'As senhas devem ser iguais.'
            })
            return
        } else {
            setErrors({
                ...errors, 
                confirmPassword: 0,
                confirmPasswordText: ''
            })
        }
    }

    const handleChange = property => event => {
        setValues({
            ...values,
            [property]: event.nativeEvent.text
        })
    }

    const handleSubmit = () => {
        setLoading(true)
        if(validateConfirmPassword(values.confirmNewPassword) && validatePassword(values.newPassword)) {
            userService.updatePassword(values.newPassword, user.cdcliente, user.cdemissora)
                .then( response => {
                    if(response.idstatus === '1') {
                        AsyncStorage.removeItem('password')
                        AsyncStorage.setItem('password', values.newPassword)
                        setLoading(false)
                        navigation.goBack(null)
                    } else {
                        setLoading(false)
                        Alert.alert(
                            'Erro ao atualizar a senha',
                            response.dsstatus
                        )
                    }
                })
        } else {
            Alert.alert(
                'Error',
                'Informe uma senha válida.'
            )
        }
    }

    function init() {
        userService.refreshToken()
            .then( response => {
                console.log('refreshToken response: ', response)
                if(response.idstatus === '1') {
                    AsyncStorage.removeItem('token')
                    AsyncStorage.setItem('token', response.token)
                }
            })
    }
    

    return (
        <Container>
            <NavigationEvents 
                onDidFocus={ payload => init() }
            />
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={globalStyles.scrollView}
                contentContainerStyle={styles.padding}
            >
                <View style={[styles.container]}>
                    <View style={styles.closeButtonContainer}>
                        <TouchableRipple
                            style={styles.closeButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Icon name='md-close' size={30} color={COLORS.lightColor} />
                        </TouchableRipple>
                    </View>
                    <Text style={[styles.text, styles.container, styles.textCentered]}>
                        ALTERAR SENHA
                    </Text>
                    <View style={[styles.marginVertical10, styles.marginTop]}>
                        <View style={[styles.column,]}>
                            <Text style={globalStyles.text}>Senha atual</Text>
                            <TextInput
                                secureTextEntry
                                autoCapitalize="none"
                                keyboardType='default'
                                style={globalStyles.textInput}
                                textContentType='password'
                                value={values.password}
                                onChange={handleChange('password')}

                                underlineColorAndroid={COLORS.lightColor}
                            />
                        </View>
                        <View style={[styles.column,  styles.marginTop]}>
                            <Text style={globalStyles.text}>Nova senha</Text>
                            <TextInput 
                                secureTextEntry
                                autoCapitalize="none"
                                keyboardType='default'
                                style={globalStyles.textInput}
                                textContentType='newPassword'
                                value={values.newPassword}
                                onChange={handleChange('newPassword')}
                                onChangeText={ text => validatePassword(text)}
                                underlineColorAndroid={COLORS.lightColor}
                            />
                            <HelperText
                                type='error'
                                visible={errors.password === 1}
                            >
                                {errors.passwordText}
                            </HelperText>
                        </View>
                        <View style={[styles.column,  styles.marginTop]}>
                            <Text style={globalStyles.text}>Confirmar nova senha</Text>
                            <TextInput 
                                secureTextEntry
                                autoCapitalize="none"
                                keyboardType='default'
                                style={globalStyles.textInput}
                                textContentType='newPassword'
                                value={values.confirmNewPassword}
                                onChange={handleChange('confirmNewPassword')}
                                onChangeText={ text => validateConfirmPassword(text)}
                                underlineColorAndroid={COLORS.lightColor}
                            />
                            <HelperText
                                type='error'
                                visible={errors.confirmPassword === 1}
                            >
                                {errors.confirmPasswordText}
                            </HelperText>
                        </View>
                    </View>
                </View>
                <TouchableOpacity 
                    style={[globalStyles.button]}
                    onPress={handleSubmit}
                    disable={loading}
                >
                    <Text style={globalStyles.textButton}>ALTERAR</Text>
                </TouchableOpacity>
            </ScrollView>
            <View style={globalStyles.loadingContainer}>
                <ActivityIndicator size='large' animating={loading}/>
            </View>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    marginVertical10: {
        marginVertical: 10,
    },
    marginTop: {
        marginTop: 20
    },
    row: {
        flexDirection: 'row',
    },
    column: {
        flexDirection: 'column',
    },
    centerAlignAround: {
        alignItems: 'center', 
        justifyContent: 'space-around'
    },
    centerAlignEvenly: {
        alignItems: 'center', 
        justifyContent: 'space-evenly'
    },
    alignCenter: {
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap'
    },
    closeButtonContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },
    closeButton: {
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 15,
    },
    padding: {
        padding: 20,
    },
    text: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    textCentered: {
        textAlign: 'center'
    },
})

const mapStateToProps = state => ({
    user: state.userState.user,
    error: state.userState.error
})

const mapDispatchToProps = dispatch => bindActionCreators({
    storeUser: user => userActions.storeUser(user),
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword)
