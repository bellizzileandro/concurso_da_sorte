import React from 'react'
import {
    SafeAreaView,
    View,
    ScrollView,
    Text,
    TextInput,
    StatusBar,
    ActivityIndicator,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ToastAndroid
} from 'react-native'
import { Appbar } from 'react-native-paper'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Icon from 'react-native-vector-icons/Ionicons'

import { 
    globalStyles,
    COLORS,
    validation
} from '../../utils'
import { userService } from '../../services/user'

function VerifyEmail(props) {

    const { navigation } = props

    const token = navigation.getParam('token', null)
    const cpf = navigation.getParam('cpf', null)
    const emailMask = navigation.getParam('emailMask', null)
    
    var [loading, setLoading] = React.useState(false)

    const handleSubmit = () => {
        setLoading(true)
        userService.sendCpfCode(token)
            .then( response => {
                if(response.idstatus === '1'){
                    setLoading(false)
                    navigation.navigate('VerifyCode', { token, cpf })  
                } else {
                    setLoading(false)
                    ToastAndroid.show('Desculpe, ocorreu erro ao enviar o código. Tente novamente.', ToastAndroid.LONG)
                }
            })
            .catch(error => {
                console.log('sendCpfCode error: ', error)
                setLoading(false)
                ToastAndroid.show('Desculpe, ocorreu erro ao enviar o código. Tente novamente.', ToastAndroid.LONG)
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
                        title='CONFIRMAR CONTA'
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
                    <View style={{ alignItems: 'center', justifyContent: 'center', marginVertical: 10 }}>
                        <View>
                            <Text style={{ fontWeight: 'bold', flexWrap: 'wrap' }}>
                                Muito bom! Um código será enviado para seu e-mail, ok? Isso é só para garantir a sua segurança.
                            </Text>
                        </View>
                    </View>
                    <View style={{ borderBottomColor: COLORS.lightColor }}>
                        <Text style={styles.text}>Email cadastrado: </Text>
                        <TextInput
                            style={styles.textInput}
                            defaultValue={emailMask}
                            underlineColorAndroid={COLORS.lightColor}
                            editable={false}
                        />
                    </View>
                    
                    <TouchableOpacity 
                        style={styles.button}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        <Text style={styles.textButton}>CONTINUAR</Text>
                    </TouchableOpacity>
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
})

export default VerifyEmail
