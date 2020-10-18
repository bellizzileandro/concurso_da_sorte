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
import { TouchableRipple, Appbar  } from 'react-native-paper'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Icon from 'react-native-vector-icons/Ionicons'

import Container from '../layout'
import { globalStyles, COLORS, storeDataAsync, validation } from '../../utils'
import AsyncStorage from '@react-native-community/async-storage'

import { userService } from '../../services/user'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { loginService } from '../../services/login'

function ResetPassword(props) {
    const { 
        navigation, 
    } = props
    
    const cpf = navigation.getParam('cpf', {})

    const [values, setValues] = React.useState({})
    const [loading, setLoading] = React.useState(false)
    const [pswType, setPswType] = React.useState(false)

    function validate(value) {
        var _r
        if(values.newPassword === values.retryNewPassword && validation.password(values.newPassword) && validation.password(values.retryNewPassword)) {
            _r = true
        } else {
            _r = false
        }

        return _r
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
            userService.getUserByCpf(cpf)
                .then( response => {
                    if(response.idstatus === '1') {
                        userService.resetPassword(values.newPassword, response.cdcliente, response.token)
                            .then( response => {
                                // console.log(response)
                                if(response.idstatus === '1') {
                                    console.log('user: ', user)
                                    loginService.getUserDataByToken(user)
                                        .then(resp => {
                                            if (resp.idstatus === '1') {
                                                const user = {
                                                    nmcliente: resp.nmcliente,
                                                    elementos: resp.elementos,
                                                    restricao: resp.restricao,
                                                    cdcliente: resp.cdcliente,
                                                    dsemail: resp.dsEmail,
                                                    nrCelular: resp.nrCelular,
                                                    termoaceito: resp.termoaceito,
                                                    customerid: resp.customerid,
                                                    dtnascimento: resp.dtnascimento
                                                }
                                                storeDataAsync(JSON.stringify(user), 'userData')
                                                storeDataAsync(resp.token, 'userToken')
                                                storeDataAsync(values.newPassword, 'password')
                                                setLoading(false)
                                                navigation.navigate('App')
                                            } else {
                                                setLoading(false)
                                                Alert.alert('Erro no cadastro', resp.dsstatus)
                                            }
                                        })
                                } else {
                                    setLoading(false)
                                    Alert.alert(
                                        'Erro ao atualizar o nome',
                                        response.dsstatus
                                    )
                                }
                            })
                    }
                })
            
        } else {
            Alert.alert(
                'Error',
                'Informe a senha corretamente.'
            )
        }
    }
    
    const handlePress = () => {
        setPswType(!pswType)
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
                    title='CRIAR NOVA SENHA'
                    titleStyle={[globalStyles.appTitle, globalStyles.centered]}
                    style={[globalStyles.centered]}
                />
                <Appbar.Action />
            </Appbar.Header>
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={globalStyles.scrollView}
                contentContainerStyle={styles.padding}
            >
                <View style={[styles.container]}>
                    <View style={globalStyles.loadingContainer}>
                        <ActivityIndicator size='large' animating={loading}/>
                    </View>
                    <Text style={[styles.text, styles.container]}>
                        Pronto! Vamos criar sua nova senha de acesso?
                    </Text>
                    <View style={[styles.marginVertical10, styles.marginTop]}>
                        <View style={[styles.column,  styles.marginTop]}>
                            <Text style={globalStyles.text}>Nova senha</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                                <TextInput 
                                    secureTextEntry
                                    autoCapitalize="none"
                                    keyboardType='default'
                                    style={[globalStyles.textInput, styles.textInputFull]}
                                    textContentType='newPassword'
                                    value={values.newPassword}
                                    onChange={handleChange('newPassword')}
                                    underlineColorAndroid={COLORS.lightColor}
                                />
                                <TouchableOpacity
                                    onPress={handlePress}
                                    style={styles.showPswStyle}
                                >
                                    <Icon name={pswType ? 'md-eye' : 'md-eye-off'} size={30} color={COLORS.lightColor} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={[styles.column,  styles.marginTop]}>
                            <Text style={globalStyles.text}>Confirmar nova senha</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                                <TextInput 
                                    secureTextEntry
                                    autoCapitalize="none"
                                    keyboardType='default'
                                    style={[globalStyles.textInput, styles.textInputFull]}
                                    textContentType='newPassword'
                                    value={values.retryNewPassword}
                                    onChange={handleChange('retryNewPassword')}
                                    underlineColorAndroid={COLORS.lightColor}
                                />
                                <TouchableOpacity
                                    onPress={handlePress}
                                    style={styles.showPswStyle}
                                >
                                    <Icon name={pswType ? 'md-eye' : 'md-eye-off'} size={30} color={COLORS.lightColor} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <Text style={{ color: COLORS.lightColor, marginTop: 5 }}>
                            Ah, lembre-se! Para ser segura, sua senha deve ter pelo menos 8 dígitos, misturando letras, números e símbolos.
                        </Text>
                    </View>
                </View>
                <TouchableOpacity 
                    style={[globalStyles.button]}
                    onPress={handleSubmit}
                    disable={loading}
                >
                    <Text style={globalStyles.textButton}>CONTINUAR</Text>
                </TouchableOpacity>
            </ScrollView>
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
    showPswStyle: {
        position: 'absolute',
        right: 15
    },
    textInputFull: {
        flex: 1
    },
})

const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword)
