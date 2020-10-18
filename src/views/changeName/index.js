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
import { unformatCelphone, unformatCpf, formatCelphone, formatCpf } from '../../utils/helpers'

import { userActions } from '../../redux/actions/user'
import { userService } from '../../services/user'
import AsyncStorage from '@react-native-community/async-storage'

function ChangeName(props) {
    var { 
        navigation,
        user,
        error,
        storeUser,
    } = props
    
    const [value, setValue] = React.useState()
    const [err, setErr] = React.useState('')
    const [loading, setLoading] = React.useState(false)

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

    function validate(name) {
        return validation.fullName(name)
    }

    const handleSubmit = () => {
        setLoading(true)
        if(validate(value)) {
            setErr('')
            let _user = {
                nmcliente: value,
                cdemissora: user.cdemissora,
                cdcliente: user.cdcliente,
                dsemail: user.dsemail,
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
                        Alert.alert(
                            'Erro',
                            'Erro ao atualizar o nome. \nTente novamente.'
                        )
                        setLoading(false)
                    }
                })
            
        } else {
            setErr('Informe o nome completo.')
            setLoading(false)
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
                        TROCAR MEU NOME
                    </Text>
                    <View style={[styles.row, styles.alignCenter]}>
                        <Text style={[styles.text, {color: 'rgb(240, 50, 50)'}]}>
                            ATENÇÃO:
                        </Text>
                        <Text style={[styles.text]}>
                            Caso seja sorteado, o prêmio será entregue para o titular do CPF cadastrado no aplicativo.
                        </Text>
                    </View>
                    <View style={[styles.marginVertical10, styles.marginTop]}>
                        <View style={[styles.column,]}>
                            <Text style={globalStyles.text}>Novo nome completo</Text>
                            <TextInput 
                                autoCapitalize="words"
                                keyboardType='default'
                                style={globalStyles.textInput}
                                textContentType='name'
                                value={value || user.nmcliente}
                                onChangeText={ text => setValue(text)}
                                underlineColorAndroid={COLORS.lightColor}
                            />
                            <Text style={globalStyles.text}>{user.cpf}</Text>
                            <HelperText
                                type='error'
                                visible={error || err}
                            >
                                {err}
                            </HelperText>
                        </View>
                    </View>
                    
                    
                </View>
                
                <TouchableOpacity 
                    style={[globalStyles.button]}
                    onPress={handleSubmit}
                    disabled={loading}
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

export default connect(mapStateToProps, mapDispatchToProps)(ChangeName)
