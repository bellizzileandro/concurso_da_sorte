import React from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Alert,
    Linking
} from 'react-native'
import { TouchableRipple, Checkbox } from 'react-native-paper'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Icon from 'react-native-vector-icons/Ionicons'
import { WebView } from 'react-native-webview'

import Container from '../layout'
import { globalStyles, COLORS } from '../../utils'
import AsyncStorage from '@react-native-community/async-storage'
import { userService } from '../../services/user'
import { ticketService } from '../../services/tickets'

function BuyTicket(props) {
    const { 
        navigation, 
    } = props

    const item = navigation.getParam('item')
    const token = navigation.getParam('token')
    // console.log(item)

    const _uri = `http://concursodasorte.com.br/#/Comprar?token=${token}&promo=${item.rcdpromocao}&valor=${item.rvlbilhete}`


    return (
        <Container>
            <View style={styles.closeButtonContainer}>
                <TouchableRipple
                    style={styles.closeButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name='md-close' size={25} color={COLORS.lightColor} />
                </TouchableRipple>
            </View>
            <WebView
                source={{ uri: _uri }}
                style={{ marginTop: 20 }}
            />
        </Container>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    startAlign: {
        justifyContent: 'flex-start',
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
    closeButtonContainer: {
        position: 'absolute',
        zIndex: 999,
        top: 20,
        right: 20,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    closeButton: {
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    padding: {
        padding: 20,
    },
    greenText: {
        color: COLORS.primaryColor,
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 10,
    },
    text: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    textCentered: {
        textAlign: 'center'
    },
    clearButtonText: {
        color: COLORS.secondColor,
        textDecorationStyle: 'solid',
        textDecorationLine: 'underline',
        textDecorationColor: COLORS.secondColor,
    },
})

const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(BuyTicket)
