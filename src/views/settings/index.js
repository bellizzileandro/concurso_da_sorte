import React from 'react'
import {
    View,
    StyleSheet,
} from 'react-native'
import { 
    Appbar,
    List,
    Divider
} from 'react-native-paper'
import { NavigationEvents } from 'react-navigation'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux' 
import AsyncStorage from '@react-native-community/async-storage'

import { formatCpf, formatCelphone } from '../../utils/helpers'
import { globalStyles, COLORS } from '../../utils'

import Container from '../layout'
import { userActions } from '../../redux/actions/user'

function Settings(props) {
    const { 
        navigation,
        user,
        storeUser
    } = props

    async function getUserData() {
        let _u = await AsyncStorage.getItem('userData')
        let _user = JSON.parse(_u)
        if(!_user.cpf.includes('.')) {
            let _cpf = formatCpf(_user.cpf)
            _user.cpf = _cpf
        }
        if(!_user.nrCelular.includes('(')) {
            let cel = formatCelphone(_user.nrCelular)
            _user.nrCelular = cel
        }

        storeUser(_user)
    }

    const signout = () => {
        AsyncStorage.removeItem('userData')
        AsyncStorage.removeItem('userToken')
        storeUser({}) // limpa os dados do estado do aplicativo por segurança
        navigation.navigate('Auth')
    }

    return (
        <Container>
            <NavigationEvents 
                onDidFocus={ payload => getUserData() }
            />
            <Appbar style={globalStyles.topBar}>
                <Appbar.Content 
                    title='MEUS DADOS'
                    style={{ alignItems: 'center', justifyContent: 'center' }}
                />                    
            </Appbar>
            <View style={styles.container}>
                <List.Item
                    title="Configurações"
                    right={props => <List.Icon {...props} icon="chevron-right" color={COLORS.mediumGray} />}
                    onPress={() => navigation.navigate('Perfil')}
                />
                <Divider />
                <List.Item
                    title="Pagamento"
                    right={props => <List.Icon {...props} icon="chevron-right" color={COLORS.mediumGray} />}
                    onPress={() => navigation.navigate('Payment')}
                />
                <Divider />
                <List.Item
                    title="Informações Legais"
                    right={props => <List.Icon {...props} icon="chevron-right" color={COLORS.mediumGray} />}
                    onPress={() => navigation.navigate('LegalInformation')}
                />
                <Divider />
                <List.Item
                    title="Sair do aplicativo"
                    titleStyle={styles.greenText}
                    right={props => <List.Icon {...props} icon="chevron-right" color={COLORS.mediumGray} />}
                    onPress={signout}
                />
                <Divider />
            </View>
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        flexDirection: 'column', 
        padding: 20, 
        marginVertical: 40
    },
    greenText: {
        color: COLORS.primaryColor
    },
})

const mapStateToProps = state => ({
    user: state.userState.user
})

const mapDispatchToProps = dispatch => bindActionCreators({
    storeUser: user => userActions.storeUser(user)
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
