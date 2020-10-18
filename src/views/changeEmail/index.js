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
import { NavigationEvents } from 'react-navigation'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Icon from 'react-native-vector-icons/Ionicons'

import Container from '../layout'
import { globalStyles, COLORS, validation } from '../../utils'
import AsyncStorage from '@react-native-community/async-storage'
import { formatCelphone, formatCpf, unformatCelphone, unformatCpf } from '../../utils/helpers'

import { userService } from '../../services/user'
import { userActions } from '../../redux/actions'

function ChangeEmail(props) {
    const { 
        navigation, 
        user,
        storeUser
    } = props

    const [values, setValues] = React.useState({})
    const [loading, setLoading] = React.useState(false)
    var [error, setError] = React.useState({})

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

    function validate(value) {
        var _r
        if(validation.email(value.email) && validation.email(value.confirmEmail) && value.email === value.confirmEmail) {
            _r = true
            setError({
                ...error,
                email: 0,
                emailText:''
            })
        } else if(value.email != value.confirmEmail) {
            _r = false
            setError({
                ...error,
                confirmEmail: 1,
                confirmEmailText:'Os e-mails devem ser iguais.'
            })
        }

        return _r
    }

    function verifyEmail(email, property, output) {
        console.log(validation.email(email))
        if(validation.email(email)) {
            userService.checkEmail(email)
                .then(response => {
                    console.log('changeEmail response: ', )
                    if(response.idstatus === '0'){
                        setError({
                            ...error,
                            [property]: 0,
                            [output]:''
                        })
                    } else {
                        setError({
                            ...error,
                            [property]: 1,
                            [output]:'E-mail já cadastrado.'
                        })
                    }
                })
                .catch(err => {
                    setError({
                        ...error,
                        [property]: 1,
                        [output]: 'Erro inesperado. Tente novamente mais tarde'
                    })
                })
        } else {
            setError({
                ...error,
                [property]: 1,
                [output]:'Informe um e-mail válido.'
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
        if(validate(values)) {
            let _user = {
                nmcliente: user.nmcliente,
                cdemissora: user.cdemissora,
                cdcliente: user.cdcliente,
                dsemail: values.email,
                nrCelular: unformatCelphone(user.nrCelular),
                termoaceito: user.termoaceito,
                customerid: user.customerid,
                dtnascimento: user.dtnascimento,
                cpf: unformatCpf(user.cpf)
            }
            userService.updateUser(_user)
                .then( response => {
                    if(response.idstatus === '1') {
                        _user.nrCelular = formatCelphone(_user.nrCelular)
                        _user.cpf = formatCpf(_user.cpf)
                        AsyncStorage.removeItem('userData')
                        AsyncStorage.setItem('userData', JSON.stringify(_user))
                        storeUser(_user)
                        setLoading(false)
                        navigation.goBack(null)
                    } else {
                        setLoading(false)
                        Alert.alert(
                            'Erro ao atualizar o nome',
                            response.dsstatus
                        )
                    }
                })
        } else {
            Alert.alert(
                'Error',
                'Informe o nome completo.'
            )
        }
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
                        ALTERAR E-MAIL
                    </Text>
                    <View style={[styles.marginVertical10, styles.marginTop]}>
                        <View style={[styles.column,]}>
                            <Text style={globalStyles.text}>Novo e-mail</Text>
                            <TextInput 
                                autoCapitalize="none"
                                keyboardType='email-address'
                                style={globalStyles.textInput}
                                textContentType='emailAddress'
                                value={values.email}
                                onChange={handleChange('email')}
                                onBlur={() => verifyEmail(values.email, 'email', 'emailText')}
                                underlineColorAndroid={COLORS.lightColor}
                            />
                            <HelperText
                                type='error'
                                visible={error.email === 1}
                            >
                                {error.emailText}
                            </HelperText>
                        </View>
                        <View style={[styles.column,  styles.marginTop]}>
                            <Text style={globalStyles.text}>Confirmar e-mail</Text>
                            <TextInput 
                                autoCapitalize="none"
                                keyboardType='email-address'
                                style={globalStyles.textInput}
                                textContentType='emailAddress'
                                value={values.confirmEmail}
                                onChange={handleChange('confirmEmail')}
                                onBlur={() => verifyEmail(values.confirmEmail, 'confirmEmail', 'confirmEmailText')}
                                underlineColorAndroid={COLORS.lightColor}
                            />
                            <HelperText
                                type='error'
                                visible={error.confirmEmail === 1}
                            >
                                {error.confirmEmailText}
                            </HelperText>
                        </View>
                        <View style={[styles.column,  styles.marginTop]}>
                            <Text style={globalStyles.text}>Senha</Text>
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
    user: state.userState.user
})

const mapDispatchToProps = dispatch => bindActionCreators({
    storeUser: user => userActions.storeUser(user)
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ChangeEmail)
