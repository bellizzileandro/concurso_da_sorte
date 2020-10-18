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
import Icon from 'react-native-vector-icons/Ionicons'
import TextInputMask from 'react-native-text-input-mask'

import Container from '../layout'
import { globalStyles, COLORS } from '../../utils'
import AsyncStorage from '@react-native-community/async-storage'

import { userService } from '../../services/user'
import { userActions } from '../../redux/actions/user'
import { NavigationEvents } from 'react-navigation'
import { unformatCelphone, formatCelphone, unformatCpf, formatCpf } from '../../utils/helpers'

function ChangeTel(props) {
    const { 
        navigation, 
        user,
        storeUser
    } = props
    

    const [values, setValues] = React.useState({})
    const [loading, setLoading] = React.useState(false)
    const [errors, setErrors] = React.useState({})

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
        if(value.celphone === null || errors.celphone === 1) {
            Alert.alert('Erro', 'Informe um telefone válido.')
            _r = false
        } else {
            _r = true
        }

        return _r
    }

    const handleChange = property => event => {
        setValues({
            ...values,
            [property]: event.nativeEvent.text
        })
    }

    const verifyCel = () => {
        let phone = unformatCelphone(values.celphone)
        userService.checkCelphone(phone)
            .then(response => {
                if (response.idstatus === '0') {
                    setErrors({
                        ...errors,
                        celphone: 0,
                        celphoneText: ''
                    })
                } else {
                    setErrors({
                        ...errors,
                        celphone: 1,
                        celphoneText: 'Telefone já cadastrado.'
                    })
                }
            })
    }

    const handleSubmit = () => {
        setLoading(true)
        console.log('handleSubmit: ', user)
        let _cpf = unformatCpf(user.cpf)
        let phone = unformatCelphone(values.celphone)
        if(validate(values)) {
            let _user = {
                nmcliente: user.nmcliente,
                cdemissora: user.cdemissora,
                cdcliente: user.cdcliente,
                dsemail: user.dsemail,
                nrCelular: phone,
                termoaceito: user.termoaceito,
                customerid: user.customerid,
                dtnascimento: user.dtnascimento,
                cpf: _cpf
            }
            console.log('_user: ', _user)
            userService.updateUser(user)
                .then( response => {
                    // console.log('update name: ', response)
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
                            'Erro ao atualizar o telefone',
                            response.dsstatus
                        )
                    }
                })
        } else {
            Alert.alert(
                'Error',
                'Informe o telefone.'
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
                        ALTERAR TELEFONE
                    </Text>
                    <View style={[styles.marginVertical10, styles.marginTop]}>
                        <View style={[styles.column,]}>
                            <Text style={globalStyles.text}>Novo telefone</Text>
                            <TextInputMask 
                                placeholder='(00) 00000 0000'
                                keyboardType='number-pad'
                                style={[globalStyles.textInput]}
                                mask={'([00]) [00000] [0000]'}
                                value={values.celphone}
                                onChange={handleChange('celphone')}
                                onBlur={() => verifyCel()}
                                underlineColorAndroid={COLORS.lightColor}
                            />
                            <Text style={globalStyles.text}>Um código de confirmação será enviado para este número</Text>
                        </View>
                    </View>
                    <HelperText
                        type='error'
                        visible={errors.celphone === 1}
                    >
                        {errors.celphoneText}
                    </HelperText>
                </View>
                <TouchableOpacity 
                    style={[globalStyles.button]}
                    onPress={handleSubmit}
                    disable={loading}
                >
                    <Text style={globalStyles.textButton}>CONTINUAR</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(ChangeTel)
