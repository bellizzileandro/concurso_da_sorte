import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Alert,
    ActivityIndicator
} from 'react-native'
import { 
    Appbar,
    List,
    Checkbox,
    Divider,
} from 'react-native-paper'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux' 
import { NavigationEvents } from 'react-navigation'
import Icon from 'react-native-vector-icons/Ionicons'

import { globalStyles, COLORS } from '../../utils'
import Container from '../layout'
import AsyncStorage from '@react-native-community/async-storage'
import { userService } from '../../services/user'
import { userActions } from '../../redux/actions/user'

function Payment(props) {
    const { 
        navigation,
        user,
        cards,
        loading,
        getCardsData
    } = props

    const [checkId, setCheck] = React.useState(0)

    function Item({item}) {
        return (
            <View style={styles.cardContainer}>
                <Icon name='ios-card' size={25} color={COLORS.lightColor} />
                <Text>{`****${item.nrfinalcartao}`}</Text>
                <Text>{item.dtvalidadecartao}</Text>
                <Checkbox 
                    status={checkId === item.cardcli ? 'checked' : 'unchecked'}
                    disabled={false}
                    onPress={() => handleConfirm(item)}
                />
            </View>
        )
    }

    const handleConfirm = item => {
        setCheck(item.cardcli)
        userService.changePreferCard(item)
            .then(resp => {
                if(resp.idstatus === '0') {
                    Alert.alert(
                        'Erro inesperado.',
                        'Ocorreu um erro ao tentar trocar de cartão. Tente novamente.'
                    )
                }
            })
            .catch(error => {
                // console.log(error)
            })
    }

    function verifyPrefererCard() {
        cards.map( card => {
            if(card.cardcli === user.cardcli) {
                setCheck(card.cardcli)
                return
            }
        })
    }

    function init() {
        getCardsData()
        verifyPrefererCard()
        userService.refreshToken()
            .then( response => {
                console.log('refreshToken response: ', response)
                if(response.idstatus === '1') {
                    AsyncStorage.removeItem('token')
                    AsyncStorage.setItem('token', response.token)
                }
            })   
            
        
    }
    
    return (
        <Container>
            <NavigationEvents 
                onDidFocus={ payload => init() }
            />
            <Appbar style={globalStyles.topBar}>
                <Appbar.Action 
                    icon="chevron-left" 
                    onPress={() => navigation.goBack()}
                    size={30}
                />
                <Appbar.Content 
                    title='PAGAMENTO'
                    style={{ alignItems: 'center', justifyContent: 'center' }}
                />   
                <Appbar.Action />                 
            </Appbar>
            <View style={styles.container}>
                
                <List.Item
                    title="Adicionar cartão de crédito"
                    right={props => <List.Icon {...props} icon="chevron-right" color={COLORS.mediumGray} />}
                    onPress={() => navigation.navigate('NewCard')}
                />
                <Divider />
                
                    
                <View style={globalStyles.loadingContainer}>
                    <ActivityIndicator size='large' animating={loading}/>
                </View>
            
                <FlatList 
                    contentContainerStyle={styles.flatContentContainer}
                    style={styles.flatContainer}
                    data={cards}
                    renderItem={ ({item}) => <Item item={item} />  }
                    keyExtractor={(item, index) => index.toString()}
                />
                    
                
                
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
    flatContainer: {
        marginTop: 20
    },
    greenText: {
        color: COLORS.primaryColor
    },
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
})

const mapStateToProps = state => ({
    cards: state.userState.cards,
    user: state.userState.user,
    loading: state.userState.loading
})

const mapDispatchToProps = dispatch => bindActionCreators({
    getCardsData: () => userActions.getCardsData()
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Payment)
