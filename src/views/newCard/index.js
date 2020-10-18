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
import { TouchableRipple, IconButton } from 'react-native-paper'
import { connect } from 'react-redux'
import { LiteCreditCardInput } from "react-native-credit-card-input"
import { SvgUri } from 'react-native-svg'
import Icon from 'react-native-vector-icons/Ionicons'
import moment from 'moment'

import { CardIOModule } from 'react-native-awesome-card-io'
import { userService } from '../../services/user'

import Container from '../layout'
import { globalStyles, COLORS } from '../../utils'
import { formatCreditCardName, unformatCreditCard } from '../../utils/helpers'

function NewCard(props) {
    const { 
        navigation,
        countries,
    } = props

    const [cardName, setCardName] = React.useState()
    const [country, setCountry] = React.useState('Brasil')
    const [image, setImage] = React.useState(countries[31].flag)
    const [card, setCard] = React.useState({})
    const [loading, setLoading] = React.useState(false)

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

    const handleChangeCountry = country => {
        setCountry(country)
        countries.map((item) => {
            if(item.nativeName === country) {
                setImage(item.flag)
                return
            } 
        })
    }

    /** Verifica a ocorrência de algum caracter especial e substitui pela letra sem o acento */
    const verifyName = text => {
        let _name = formatCreditCardName(text)
        setCardName(_name)
        return _name
    }

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
                // console.log('card', card)
                let month = card.expiryMonth
                let year = card.expiryYear
                let _expiry = moment([year, month - 1, 1]).format('MM/YY')

                let name = verifyName(card.cardholderName)
                
                let _card = {
                    nrcartao: card.cardNumber, 
                    dtvalidadecartao: _expiry, 
                    nmcartao: name
                }

                insertCard(_card)
                
            })
            .catch( err => {
                setLoading(false)
                console.log('card scan error: ', err)
            })
    }

    function insertCard(card) {
        setLoading(true)
        userService.insertCard(card)
            .then( response => {
                // console.log('insert card resp: ', response)
                if (response.idstatus === '1') {
                    setLoading(false)
                    navigation.goBack(null)
                } else {
                    setLoading(false)
                    Alert.alert('Erro no cadastro', response.dsstatus)
                }
            })
            .catch( error => {
                setLoading(false)
                // console.log(error)
            })
    }

    const handleSubmit = () => {
        if(card.isValid) {
            const _card = {}
            _card.nrcartao = card.cardNumber.replace(' ', '').replace(' ', '').replace(' ', '')
            _card.dtvalidadecartao = card.expiry
            _card.nmcartao = cardName
            // console.log(_card)
            insertCard(_card)
        } else {
            Alert.alert('Dados inválidos.', 'Preencha dados válidos para o cartão.')
        }
    }

    return (
        <Container>
            <KeyboardAvoidingView style={[styles.padding]}>
                <View style={[styles.container]}>
                    <View style={globalStyles.loadingContainer}>
                        <ActivityIndicator size='large' animating={loading}/>
                    </View>
                    <View style={styles.closeButtonContainer}>
                        <TouchableRipple
                            style={styles.closeButton}
                            onPress={() => navigation.goBack(null)}
                        >
                            <Icon name='md-close' size={25} color={COLORS.lightColor} />
                        </TouchableRipple>
                    </View>
                    <Text style={[styles.textBold, styles.container]}>
                        ADICIONAR CARTÃO DE CRÉDITO!
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
                    </View>
                    <View style={globalStyles.textInputContainer}>
                        <Text style={globalStyles.text}>Número do cartão</Text>
                        <LiteCreditCardInput 
                            onChange={handleCardChange}
                        />
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View style={{ flex: 1, }}>
                                
                            </View>
                            
                        </View>
                    </View>
                    <View style={globalStyles.textInputContainer}>
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
                            <IconButton 
                                icon='camera'
                                size={25}
                                color={COLORS.lightColor}
                                onPress={ () => scanCard()}
                            />
                        </View>
                    </View>
                </View>
                <TouchableOpacity 
                    style={globalStyles.button}
                    onPress={handleSubmit}
                    disabled={loading}
                >
                    <Text style={globalStyles.textButton}>SALVAR</Text>
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
    textBold: {
        color: COLORS.primaryColor,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    countryCodeInput: {
        flex: 1
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
})

const mapStateToProps = state => ({
    countries: state.createUserState.countries
})

export default connect(mapStateToProps, null)(NewCard)
