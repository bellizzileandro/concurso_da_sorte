import React from 'react'
import {
    View,
    ScrollView,
    StyleSheet
} from 'react-native'
import { 
    Appbar,
    List,
    Divider
} from 'react-native-paper'
import { NavigationEvents } from 'react-navigation'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { globalStyles, COLORS } from '../../utils'
import Container from '../layout'

function Perfil(props) {
    const {
        navigation,
        user
    } = props

    return (
        <Container>
            <Appbar style={globalStyles.topBar}>
                <Appbar.Action 
                    icon="chevron-left" 
                    onPress={() => navigation.goBack(null)}
                    size={30}
                />
                <Appbar.Content 
                    title='CONFIGURAÇÕES'
                    style={{ alignItems: 'center', justifyContent: 'center' }}
                />   
                <Appbar.Action  />                 
            </Appbar>
            <View style={styles.container}> 
                <List.Item
                    title={user.nmcliente}
                    description={`CPF: ${user.cpf}`}
                    descriptionStyle={globalStyles.text}
                    right={props => <List.Icon {...props} icon="chevron-right" color={COLORS.mediumGray} />}
                    onPress={() => navigation.navigate('ChangeName', { user })}
                />
                <Divider />
                <List.Item
                    title={user.dsemail}
                    right={props => <List.Icon {...props} icon="chevron-right" color={COLORS.mediumGray} />}
                    onPress={() => navigation.navigate('ChangeEmail', { user })}
                />
                <Divider />
                <List.Item
                    title={user.nrCelular}
                    right={props => <List.Icon {...props} icon="chevron-right" color={COLORS.mediumGray} />}
                    onPress={() => navigation.navigate('ChangeTel', { user: user })}
                />
                <Divider />
                <List.Item
                    title="Senha *******"
                    right={props => <List.Icon {...props} icon="chevron-right" color={COLORS.mediumGray} />}
                    onPress={() => navigation.navigate('ChangePassword', { user: user })}
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
    
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Perfil)
