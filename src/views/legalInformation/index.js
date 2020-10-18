import React from 'react'
import {
    View,
    ScrollView,
    StyleSheet,
    Linking
} from 'react-native'
import { 
    Appbar,
    List,
    Divider
} from 'react-native-paper'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux' 
import AsyncStorage from '@react-native-community/async-storage'

import { globalStyles, COLORS } from '../../utils'
import Container from '../layout'

function LegalInformation(props) {
    const { navigation, privacy } = props

    React.useEffect(() => {
        getUserDataAsync()
    }, [])

    // const user = navigation.getParam('user', {})
    const [user, setUser] = React.useState({})

    const getUserDataAsync = async () => {
        const keys = await AsyncStorage.getAllKeys()
        console.log(keys)
        const user = await AsyncStorage.getItem('userData')
        const _user = JSON.parse(user)
        // console.log(_user)
        setUser(_user)
    }

    const handleOpenLink = link => () => {
        Linking.openURL(link).catch((err) => console.error('An error occurred', err))
    }

    return (
        <Container>
            <Appbar style={globalStyles.topBar}>
                <Appbar.Action 
                    icon="chevron-left" 
                    onPress={() => navigation.goBack()}
                    size={30}
                />
                <Appbar.Content 
                    title='INFORMAÇÕES LEGAIS'
                    style={{ alignItems: 'center', justifyContent: 'center' }}
                />   
                <Appbar.Action  />                 
            </Appbar>
            <View style={styles.container}> 
                <List.Item
                    title="Política de privacidade"
                    descriptionStyle={globalStyles.text}
                    onPress={handleOpenLink(privacy)}
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
    privacy: state.contestState.contests.privacidade
})

const mapDispatchToProps = dispatch => bindActionCreators({
    
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(LegalInformation)
