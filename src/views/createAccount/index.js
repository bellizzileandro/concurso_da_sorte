import React from 'react'
import {
    SafeAreaView,
    StatusBar,
    ScrollView,
    View,
    Text,
    TextInput,
    Linking,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Picker,
    ActivityIndicator
} from 'react-native'
import {
    Appbar,
    HelperText,
    TouchableRipple,
    Checkbox
} from 'react-native-paper'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Icon from 'react-native-vector-icons/Ionicons'
import TextInputMask from 'react-native-text-input-mask'
import { SvgUri } from 'react-native-svg'
import moment from 'moment'

import { createUserActions } from '../../redux/actions'

import { 
    globalStyles,
    COLORS
} from '../../utils'
import { contestService } from '../../services/contest'
import { userService } from '../../services/user'
import { unformatCpf, unformatCelphone, resetBirthdate } from '../../utils/helpers'
import { validation } from '../../utils'

function CreateAccount(props) {
    const { 
        navigation, 
        store,
        sendSms,
        countries,
        loading
    } = props

    const [values, setValues] = React.useState({})
    const [code, setPhoneCode] = React.useState('55')
    const [image, setImage] = React.useState(countries[31].flag)
    const [pswType, setPswType] = React.useState(true)
    const [errors, setErrors] = React.useState({})
    const [check, setCheck] = React.useState(false)
    const [termos, setTermos] = React.useState({})

    React.useEffect(() => {
        contestService.getAll()
            .then( resp => {
                if(resp.idstatus === '1') {
                    setTermos({
                        ...termos,
                        termouso: resp.termouso,
                        privacidade: resp.privacidade
                    })
                }
            })
    }, [])

    const openPdf = url => {
        Linking.openURL(url).catch((err) => console.error('An error occurred', err))
    }

    const handleChange = property => e => {
        setValues({
            ...values,
            [property]: e.nativeEvent.text
        })
    }

    // const resetBirthdate = date => {
    //     if (date != null && date.length === 10) {
    //         let arrDate = date.split('/')
    //         let d = new Date(parseInt(arrDate[2], 10), parseInt(arrDate[1], 10) - 1, parseInt(arrDate[0], 10))
    //         let _d = moment(d).format('YYYY/MM/DD')
    //         setValues({
    //             ...values,
    //             birthdate: _d
    //         })
    //     }
    // }

    function validateName() {
        if(!validation.fullName(values.name)) {
            setErrors({
                ...errors,
                name: 1,
                nameText: 'Nome completo deve ser preenchido.'
            })
        } else {
            setErrors({
                ...errors,
                name: 0,
                nameText: ''
            })
        }
    }

    function validateCPF() {
        if(!validation.cpf(values.cpf)) {
            setErrors({
                ...errors,
                cpf: 1,
                cpfText: 'Entre com CPF válido.'
            })
            return
        } else {
            setErrors({
                ...errors,
                cpf: 0,
                cpfText: ''
            })
        }
    }

    function validateBirthdate() {
        if(values.birthdate === null) {
            setErrors({
                ...errors,
                birthdate: 1,
                birthdateText: 'Data de nascimento deve ser preenchida.'
            })
            
            return
        } else if(!validation.dateIsValid(values.birthdate)) {
            setErrors({
                ...errors,
                birthdate: 1,
                birthdateText: 'Entre com uma data de nascimento válida.'
            })
            setValues({
                ...values,
                birthdate: ''
            })
            return
        } else if(!validation.validOlderAge(values.birthdate)) {
            setErrors({
                ...errors,
                birthdate: 1,
                birthdateText: 'Deve possuir 18 anos ou mais.'
            })
            return
        } else {
            setErrors({
                ...errors,
                birthdate: 0,
                birthdateText: ''
            })
        }
    }

    function validateEmail() {
        userService.checkEmail(values.email)
            .then(response => {
                if(response.idstatus === '1') {
                    setErrors({
                        ...errors,
                        email: 1,
                        emailText: 'E-mail já cadastrado.'
                    })
                    return
                } else {
                    setErrors({
                        ...errors,
                        email: 0,
                        emailText: ''
                    })
                }
            })
            .catch(error => {
                Alert.alert(
                    'Erro inesperado',
                    'Erro inesperado no servidor. \nTente novamente mais tarde.'
                )
            })
        if(!validation.email(values.email)) {
            setErrors({
                ...errors,
                email: 1,
                emailText: 'Entre com um email válido.'
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

    function validateRetryEmail() {
        if(!validation.email(values.retryEmail)) {
            setErrors({
                ...errors,
                retryEmail: 1,
                retryEmailText: 'Entre com um email válido.'
            })
            return
        } else {
            setErrors({
                ...errors,
                retryEmail: 0,
                retryEmailText: ''
            })
        }
    }

    function validateCelphone() {
        if(values.celphone === null || values.celphone === undefined || values.celphone.length < 1) {
            setErrors({
                ...errors,
                celphone: 1,
                celphoneText: 'Digite um celular válido.'
            })
        } else {
            setErrors({
                ...errors,
                celphone: 0,
                celphoneText: ''
            })
        }
    }

    function validatePassword() {
        if(!validation.password(values.password)) {
            setErrors({
                ...errors,
                password: 1,
                passwordText: 'A senha deve conter no mínimo 6 caracteres, entre letras, números e  caracteres especiais.'
            })
        } else {
            setErrors({
                ...errors,
                password: 0,
                passwordText: ''
            })
        }
    }

    function validateRetryPassword() {
        if(!validation.password(values.retryPassword)) {
            setErrors({
                ...errors,
                retryPassword: 1,
                retryPasswordText: 'A senha deve conter no mínimo 6 caracteres, entre letras, números e  caracteres especiais.'
            })
        } else if(values.retryPassword != values.password) {
            setErrors({
                ...errors,
                retryPassword: 1,
                retryPasswordText: 'As senhas devem ser iguais.'
            })
        } else {
            setErrors({
                ...errors,
                retryPassword: 0,
                retryPasswordText: ''
            })
        }
    }

    function submitValidate(data) {
        if(data.name != 0) {
            Alert.alert('Erro no nome', 'Nome completo deve ser preenchido corretamente.')
            return false
        }
        if(data.cpf != 0) {
            Alert.alert('Erro no cpf', 'CPF deve ser preenchido corretamente.')
            return false
        }
        if(data.birthdate != 0) {
            Alert.alert('Erro na data de nascimento', 'Data de nascimento deve ser preenchida corretamente.')
            return false
        }
        if(data.email != 0) {
            Alert.alert('Erro no e-mail', 'E-mail deve ser preenchido corretamente.')
            return false
        }
        if(data.email != data.retryEmail) {
            Alert.alert('Erro no e-mail', 'Os e-mails informados devem ser os mesmos.')
            return false
        }
        if(data.celphone != 0) {
            Alert.alert('Erro no celular', 'Celular deve ser preenchido corretamente.')
            return false
        }
        if(data.password != 0) {
            Alert.alert('Erro na senha', 'Senha deve ser preenchido corretamente.')
            return false
        }
        if(data.password != data.retryPassword) {
            Alert.alert('Erro na senha', 'As senhas não são iguais.')
            return false
        }
        if(!check) {
            Alert.alert('Erro', 'Termos de uso e Política de Privacidade devem ser aceitos.')
            return false
        }
        return true
    }

    async function fixData() {
        // let phone = await values.celphone.replace(')', '').replace('(', '').replace(' ', '')        
        let phone = await unformatCelphone(values.celphone)        
        // let _cpf = await values.cpf.replace('.', '').replace('.', '').replace('-','')
        let _cpf = await unformatCpf(values.cpf)
        await setValues({
            ...values,
            celphone: phone,
            cpf: _cpf
        })
    }

    const handleSubmit = () => {
        fixData()
        if(submitValidate(errors)) {
            store(values)   
            let cell = `${code}${values.celphone}`
            sendSms(cell)
            navigation.navigate('UserConfirmation', {cell})
        }
        
    }

    const handlePress = () => {
        setPswType(!pswType)
    }

    const handleConfirm = () => {
        if(!check) {
            setValues({
                ...values,
                dtConfirm: moment().format('YYYY-MM-DD hh:mm:ss')
            })
        } else {
            setValues({
                ...values,
                dtConfirm: null
            })
        }
        setCheck(!check)
    }

    const handleChangeCountry = code => {
        setPhoneCode(code)
        countries.map((item) => {
            if(item.callingCodes[0] === code) {
                setImage(item.flag)
                return
            } 
        })
    }

    const verifyEmail = () => {
        userService.checkEmail(values.email)
            .then(response => {
                console.log(response)
                if (response.idstatus === '0') {
                    setErrors({
                        ...errors,
                        email: 0,
                        emailText: ''
                    })
                    
                } else {
                    setErrors({
                        ...errors,
                        email: 1,
                        emailText: 'E-mail já cadastrado.'
                    })
                }
            })
    }

    const verifyCpf = () => {
        let _cpf = unformatCpf(values.cpf)
        userService.checkCpf(_cpf)
            .then(response => {
                console.log(response)
                if (response.idstatus === '0') {
                    setErrors({
                        ...errors,
                        cpf: 0,
                        cpfText: '333'
                    })
                } else {
                    setErrors({
                        ...errors,
                        cpf: 1,
                        cpfText: 'CPF já cadastrado.'
                    })
                    
                }
            })
    }

    const verifyCel = () => {
        console.log(values.celphone)
        let _cel = unformatCelphone(values.celphone)
        console.log(_cel)
        userService.checkCelphone(_cel)
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

    return (
        <>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={globalStyles.container}>
                <Appbar.Header
                    style={globalStyles.appbar}
                >
                    <Appbar.BackAction 
                        onPress={() => navigation.goBack()}
                    />
                    <Appbar.Content 
                        title='CADASTRO'
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
                        <Text style={globalStyles.text}>Nome completo</Text>
                        <TextInput 
                            autoCapitalize="words"
                            style={globalStyles.textInput}
                            textContentType='name'
                            value={values.name}
                            onChange={handleChange('name')}
                            onEndEditing={() => validateName()}
                            underlineColorAndroid={COLORS.lightColor}
                        />
                        <HelperText
                            type='error'
                            visible={errors.name === 1}
                        >
                            {errors.nameText}
                        </HelperText>
                    </View>
                    <View style={globalStyles.textInputContainer}>
                        <Text style={globalStyles.text}>CPF</Text>
                        <TextInputMask 
                            style={globalStyles.textInput}
                            keyboardType='number-pad'
                            mask={'[000]{.}[000]{.}[000]{-}[00]'}
                            value={values.cpf}
                            onChange={handleChange('cpf')}
                            onEndEditing={() => validateCPF()}
                            onBlur={() => verifyCpf()}
                            underlineColorAndroid={COLORS.lightColor}
                        />
                        <HelperText
                            type='error'
                            visible={errors.cpf === 1}
                        >
                            {errors.cpfText}
                        </HelperText>
                    </View>
                    <View style={globalStyles.textInputContainer}>
                        <Text style={globalStyles.text}>Data Nascimento</Text>
                        <TextInputMask 
                            style={globalStyles.textInput}
                            keyboardType='number-pad'
                            placeholder='01/01/1900'
                            mask={'[00]{/}[00]{/}[0000]'}
                            value={values.birthdate}
                            onChange={handleChange('birthdate')}
                            onEndEditing={() => validateBirthdate()}
                            underlineColorAndroid={COLORS.lightColor}
                        />
                        <HelperText
                            type='error'
                            visible={errors.birthdate === 1}
                        >
                            {errors.birthdateText}
                        </HelperText>
                    </View>
                    <View style={globalStyles.textInputContainer}>
                        <Text style={globalStyles.text}>E-mail</Text>
                        <TextInput 
                            autoCapitalize="none"
                            style={globalStyles.textInput}
                            placeholder='email@email.com'
                            keyboardType='email-address'
                            textContentType='emailAddress'
                            value={values.email}
                            onChange={handleChange('email')}
                            onEndEditing={() => validateEmail()}
                            onBlur={() => verifyEmail()}
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
                        <Text style={globalStyles.text}>Confirmar E-mail</Text>
                        <TextInput 
                            autoCapitalize="none"
                            placeholder='email@email.com'
                            keyboardType='email-address'
                            style={globalStyles.textInput}
                            textContentType='emailAddress'
                            value={values.retryEmail}
                            onChange={handleChange('retryEmail')}
                            onEndEditing={() => validateRetryEmail()}
                            underlineColorAndroid={COLORS.lightColor}
                        />
                        <HelperText
                            type='error'
                            visible={errors.retryEmail === 1}
                        >
                            {errors.retryEmailText}
                        </HelperText>
                    </View>
                    <View style={globalStyles.textInputContainer}>
                        <Text style={globalStyles.text}>Celular</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ width: '60%', flexDirection: 'row', alignItems: 'center'}}>
                                <SvgUri
                                    width="25"
                                    height="25"
                                    uri={image}
                                />
                                <Picker 
                                    style={[styles.countryCodeInput]}
                                    selectedValue={code}
                                    onValueChange={(value, index) => handleChangeCountry(value)}
                                >
                                    {countries.map((item, key) => (
                                        <Picker.Item label={`${item.alpha2Code} +${item.callingCodes[0]}`} value={item.callingCodes[0]} key={key} />
                                    ))}
                                    
                                </Picker>
                            </View>
                            <TextInputMask 
                                placeholder='(00) 00000 0000'
                                keyboardType='number-pad'
                                style={[globalStyles.textInput, styles.celInput]}
                                mask={'([00]) [00000] [0000]'}
                                value={values.celphone}
                                onChange={handleChange('celphone')}
                                onEndEditing={() => validateCelphone()}
                                onBlur={() => verifyCel()}
                                underlineColorAndroid={COLORS.lightColor}
                            />
                            
                        </View>
                        <HelperText
                            type='error'
                            visible={errors.celphone === 1}
                        >
                            {errors.celphoneText}
                        </HelperText>
                    </View>
                    <View style={globalStyles.textInputContainer}>
                        <Text style={globalStyles.text}>Senha</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                            <TextInput 
                                style={[globalStyles.textInput, styles.textInputFull]}
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
                    <View style={globalStyles.textInputContainer}>
                        <Text style={globalStyles.text}>Confirmar Senha</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                            <TextInput 
                                style={[globalStyles.textInput, styles.textInputFull]}
                                textContentType='password'
                                value={values.retryPassword}
                                onChange={handleChange('retryPassword')}
                                secureTextEntry={pswType}
                                onEndEditing={() => validateRetryPassword()}
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
                            visible={errors.retryPassword === 1}
                        >
                            {errors.retryPasswordText}
                        </HelperText>
                    </View>
                    <View style={globalStyles.checkContainer}>
                        <Checkbox 
                            status={check ? 'checked' : 'unchecked'}
                            disabled={false}
                            onPress={handleConfirm}
                        />
                        <Text>Li e concordo com os </Text>
                        <TouchableOpacity 
                            style={styles.butclearButtonton}
                            onPress={() => openPdf(termos.termouso)}
                        >
                            <Text style={styles.clearButtonText}>Termos de Uso</Text>
                        </TouchableOpacity>
                        <Text> e </Text>
                        <TouchableOpacity 
                            style={styles.butclearButtonton}
                            onPress={() => openPdf(termos.privacidade)}
                        >
                            <Text style={styles.clearButtonText}>Política de Privacidade</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableRipple 
                        style={styles.button}
                        onPress={handleSubmit}
                        borderless={true}
                        rippleColor="rgba(126, 211, 33, .32)"
                    >
                        <Text style={globalStyles.textButton}>Avançar</Text>
                    </TouchableRipple>  
                                       
                </ScrollView>
            </SafeAreaView>
        </>
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
    textInputFull: {
        flex: 1
    },
    celInput: {
        width: '35%'
    },
    countryCodeInput: {
        flex: 1,
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderBottomColor: COLORS.lightColor,
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
    loading: state.createUserState.loading,
    countries: state.createUserState.countries,
    user: state.createUserState.user,
    smsStatus: state.createUserState.smsStatus
})

const mapDispatchToProps = dispatch => bindActionCreators({
    store: user => createUserActions.store(user),
    sendSms: cell => createUserActions.sendSms(cell),
    getCountries: () => createUserActions.getCountries()
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(CreateAccount)
