import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Icon from 'react-native-vector-icons/Ionicons'

import Container from '../layout'
import { globalStyles, COLORS } from '../../utils'

function FinishBuy(props) {
    const { 
        navigation, 
    } = props

    const tickets = navigation.getParam('tickets', '')

    const arrTickets = tickets.split(';')

    // console.log('arrTickets: ', arrTickets)

    return (
        <Container>
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={globalStyles.scrollView}
                contentContainerStyle={styles.padding}
            >
                <View style={[styles.container]}>
                    <View style={styles.closeButtonContainer}>
                        <TouchableRipple
                            style={styles.closeButton}
                            onPress={() => navigation.navigate('BottomTabStack')}
                        >
                            <Icon name='md-close' size={25} color={COLORS.lightColor} />
                        </TouchableRipple>
                    </View>
                    <View style={styles.column}>
                        <Text style={[styles.greenText, styles.container]}>
                            Prontinho,
                        </Text>
                        <Text style={[styles.greenText, styles.container]}>
                            Seu bilhete foi gerado com sucesso.
                        </Text>
                        <View style={[styles.text, styles.marginVertical10, styles.column, styles.centerAlignAround]}>
                            {arrTickets.map( (item, key) => (
                                <Text style={[styles.text, styles.marginVertical10]} key={key}>
                                    {item}
                                </Text>
                            ))}
                        </View>
                        <Text style={[styles.greenText, styles.marginVertical10]}>
                            Boa Sorte!
                        </Text>
                    </View>
                </View>
            </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(FinishBuy)
