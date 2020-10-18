import React from 'react'
import {
    ActivityIndicator,
    View,
    Text,
    KeyboardAvoidingView,
    TextInput,
    TouchableOpacity,
    Picker,
    StyleSheet,
    Alert
} from 'react-native'
import { Appbar, HelperText, IconButton } from 'react-native-paper'
import { connect } from 'react-redux'
import { LiteCreditCardInput } from "react-native-credit-card-input"
import { SvgUri } from 'react-native-svg'

import { CardIOModule } from 'react-native-awesome-card-io'

import { userService } from '../../services/user'
import { userActions } from '../../redux/actions'

import Container from '../layout'
import { globalStyles, COLORS } from '../../utils'
import { bindActionCreators } from 'redux'
import moment from 'moment'
import { createUserService } from '../../services/createUser'
import { loginService } from '../../services/login'
import AsyncStorage from '@react-native-community/async-storage'
import { unformatCreditCard, formatCreditCardName, resetBirthdate } from '../../utils/helpers'

function CardRegister(props) {
    const { 
        navigation,
        user,
        countries,
        getCardsData
    } = props

    var [cardName, setCardName] = React.useState()
    var [country, setCountry] = React.useState('Brasil')
    var [image, setImage] = React.useState(countries[31].flag)
    var [card, setCard] = React.useState({})
    var [loading, setLoading] = React.useState(false)
    var [errors, setErrors] = React.useState({})

    

    function scanCard() {
        CardIOModule
            .scanCard({
                useCardIOLogo: false,
                hideCardIOLogo: true,
                suppressManualEntry: true,
                usePaypalActionbarIcon: false,
                requireCardholderName: true,
                requireCVV: false,
                requireExpiry: true,
                requirePostalCode: false,
                scanExpiry: true,
            })
            .then( card => {
                setLoading(true)
                // console.log('card', card)
                let month = card.expiryMonth
                let year = card.expiryYear
                let _expiry = moment([year, month - 1, 1]).format('MM/YY')

                let name = verifyName(card.cardholderName)
                
                let _user = {
                    nrcelular: user.celphone, 
                    dttermoaceite: user.dtConfirm, 
                    dssenha: user.password, 
                    dsemail: user.email, 
                    dtnascimento: user.birthdate, 
                    nmcliente: user.name, 
                    nrcartao: unformatCreditCard(card.cardNumber), 
                    dtvalidadecartao: _expiry, 
                    nmcartao: name, 
                    cpf: user.cpf, 
                    dssenhasms: user.dssenhasms, // para WEB enviar código de SMS
                }
                createUserService.create(_user)
                    .then( response => {
                        if(response.idstatus === '1') {
                            _user.token = response.token
                            loginService.getUserDataByToken(_user)
                                .then( resp => {
                                    if(resp.idstatus === '1') {
                                        _user.cdcliente = resp.cdcliente
                                        _user.customerid = resp.customerid
                                        store(_user)
                                        AsyncStorage.setItem('userData', JSON.stringify(_user))
                                        AsyncStorage.setItem('password', _user.dssenha)
                                        AsyncStorage.setItem('token', resp.token)
                                        setLoading(false)
                                        navigation.navigate('App')
                                    } else {
                                        Alert.alert('Erro ao criar usuário', resp.dsstatus)
                                    }
                                })
                        }else {
                            Alert.alert('Erro ao criar usuário', resp.dsstatus)
                            setLoading(false)
                        }
                    })
            })
            .catch( err => {
                console.log('card scan error: ', err)
                Alert.alert('Erro inesperado.', 'Ocorreu um erro inesperado ao escanear seu cartão.\nTente novamente.')
                setLoading(false)
            })
    }


    const handleChange = event => {
        setCardName(event.nativeEvent.text)
    }

    const handleCardChange = c => {
        setCard({
            ...card,
            cardNumber: c.values.number,
            cvc: c.values.cvc,
            type: c.values.type,
            expiry: c.values.expiry,
            isValid: c.valid
        })
    }

    /** Verifica a ocorrência de algum caracter especial e substitui pela letra sem o acento */
    const verifyName = text => {
        let _name = formatCreditCardName(text)
        setCardName(_name)
        return _name
    }

    const handleChangeCountry = country => {
        setCountry(country)
        countries.map((item) => {
            if(item.nativeName === country) {
                setImage(item.flag)
                return
            } 
        })
    }

    const handleSubmit = () => {
        setLoading(true)
        if(card.isValid) {
            let birthdate = resetBirthdate(user.birthdate)
            console.log(birthdate)
            let _user = {
                nrcelular: user.celphone, 
                dttermoaceite: user.dtConfirm, 
                dssenha: user.password, 
                dsemail: user.email, 
                dtnascimento: birthdate, 
                nmcliente: user.name, 
                nrcartao: unformatCreditCard(card.cardNumber), 
                dtvalidadecartao: card.expiry, 
                nmcartao: cardName, 
                cpf: user.cpf, 
                dssenhasms: user.dssenhasms, // para WEB enviar código de SMS
            }
            console.log(_user)
            createUserService.create(_user)
                .then( response => {
                    if(response.idstatus === '1') {
                        _user.token = response.token
                        loginService.getUserDataByToken(_user)
                            .then( resp => {
                                if(resp.idstatus === '1') {
                                    _user.cdcliente = resp.cdcliente
                                    _user.customerid = resp.customerid
                                    store(_user)
                                    AsyncStorage.setItem('userData', JSON.stringify(_user))
                                    AsyncStorage.setItem('password', _user.dssenha)
                                    AsyncStorage.setItem('token', resp.token)
                                    setLoading(false)
                                    navigation.navigate('App')
                                } else {
                                    console.log(resp)
                                    Alert.alert('Erro ao criar usuário', resp.dsstatus)
                                    setLoading(false)
                                }
                            })
                    }else {
                        Alert.alert('Erro ao criar usuário', response.dsstatus)
                        console.log(response)
                        setLoading(false)
                    }
                })
                .catch(err => {
                    console.log('handleSubmit error: ', err)
                    Alert.alert('Erro inesperado', 'Ocorreu um erro inesperado ao criar sua conta.\nTente novamente mais tarde.')
                    setLoading(false)
                })
        } else {
            setLoading(false)
            Alert.alert('Dados inválidos.', 'Preencha dados válidos para o cartão.')
        }
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
                    title='CADASTRAR CARTÃO'
                    titleStyle={[globalStyles.appTitle, globalStyles.centered]}
                    style={[globalStyles.centered]}
                />
                <Appbar.Action />
            </Appbar.Header>
            <KeyboardAvoidingView style={[styles.padding]}>
                <View style={[styles.container]}>
                    <Text style={[styles.greenText, styles.container]}>
                        Pronto! Agora precisamos de um cartão de crédito válido para concluir seu cadastro.
                        Mas fique tranquilo, nada será cobrado sem sua aprovação!
                    </Text>
                    <View style={globalStyles.textInputContainer}>
                        <Text style={globalStyles.text}>Nome escrito no cartão</Text>
                        <TextInput 
                            autoCapitalize="words"
                            style={globalStyles.textInput}
                            textContentType='name'
                            value={cardName}
                            onChange={handleChange}
                            onChangeText={text => verifyName(text)}
                            underlineColorAndroid={COLORS.lightColor}
                        />
                        <HelperText
                            type='error'
                            visible={errors.cardName === 1}
                        >
                            {errors.cardNameText}
                        </HelperText>
                    </View>
                    <View style={globalStyles.textInputContainer}>
                        <Text style={globalStyles.text}>Número do cartão</Text>
                        <LiteCreditCardInput 
                            onChange={handleCardChange}
                        />
                        
                    </View>
                    <View style={globalStyles.textInputContainer, {flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{flex: 1, flexDirection: 'column', alignItems: 'flex-start'}}>
                        <Text style={globalStyles.text}>País/região</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <View style={{ width: '60%', flexDirection: 'row', alignItems: 'center'}}>
                                    <SvgUri
                                        width="25"
                                        height="25"
                                        uri={image}
                                    />
                                    <Picker 
                                        style={[styles.countryCodeInput]}
                                        selectedValue={country}
                                        onValueChange={(value, index) => handleChangeCountry(value)}
                                    >
                                        {countries.map((item, key) => (
                                            <Picker.Item label={item.nativeName} value={item.nativeName} key={key} />
                                        ))}
                                        
                                    </Picker>
                                </View>
                            </View>
                        </View>
                        <View>
                            <IconButton 
                                icon='camera'
                                size={25}
                                color={COLORS.lightColor}
                                onPress={() => scanCard()}
                            />
                        </View>
                    </View>
                </View>
                <TouchableOpacity 
                    style={globalStyles.button}
                    onPress={handleSubmit}
                >
                    <Text style={globalStyles.textButton}>Salvar</Text>
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
        marginBottom: 10,
    },
    countryCodeInput: {
        flex: 1
    },
})

const mapStateToProps = state => ({
    isLoading: state.createUserState.loading,
    countries: state.createUserState.countries,
    user: state.createUserState.user,
    registerStatus: state.createUserState.registerStatus,
    login: state.createUserState.login
})

const mapDispatchToProps = dispatch => bindActionCreators({
    store: user => userActions.storeUser(user),
    getCardsData: () => userActions.getCardsData()
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CardRegister)
