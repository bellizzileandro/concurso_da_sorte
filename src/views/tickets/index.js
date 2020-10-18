import React from 'react'
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Image,
    Alert,
    ActivityIndicator,
} from 'react-native'
import { 
    Appbar,
} from 'react-native-paper'
import { NavigationEvents } from 'react-navigation'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux' 
import moment from 'moment'

import Container from '../layout'
import { globalStyles, COLORS } from '../../utils'
import { ticketService } from '../../services/tickets'
import { ticketActions } from '../../redux/actions'
import AsyncStorage from '@react-native-community/async-storage'

function Tickets(props) {

    const { 
        navigation, 
        contests,
        history,
        tickets,
        getHistory,
        getAllWinners,
        loading
    } = props

    var [pagination, setPagination] = React.useState(1)
    var [refreshing, setRefreshing] = React.useState(false)

    function handleCallPagination() {
        console.log('handleCallPagination')
        // console.log(pagination)
        var pag = pagination + 1
        setPagination(pag)
        getHistory(pag)
        getAllWinners(pag)
    }
    
    const handleRefresh = () => {
        setRefreshing(true)
        getAllWinners(pagination)
        getHistory(pagination)
        setRefreshing(false)
    }

    function handleHistory() {
        setPagination(1)
        getHistory(1)
        getAllWinners(1)
    }

    /**
     * Consultado em stackoverflow
     * 
     * https://stackoverflow.com/questions/53015468/onendreached-not-working-in-react-native-flatlist 
     * 
     */
    const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
        const paddingToBottom = 40 //Distance from the bottom you want it to trigger
        return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom
    }

    function Item({item}) {
        let dtInicio = moment(item.dtinicio).format('DD/MM/YYYY')
        let dtFim = moment(item.dtfim).format('DD/MM/YYYY')
        let m = moment().format('YYYY-MM-DD')   
        return (
            <View 
                style={
                    styles.cardContainer
                }
            >
                <View 
                    style={{
                            ...styles.column, 
                            ...{marginBottom: 25},
                        }}
                    >
                    <Text 
                        style={{
                            ...styles.cardTitle, 
                            ...styles.boldText,
                            ...(moment(m).isAfter(item.dtfim)) ? {...styles.grayText} : {}
                        }}
                    >
                        {item.nmpromocao}
                    </Text>
                    <Text style={[styles.cardSubtitle, styles.grayText]}>{dtInicio} à {dtFim}</Text>
                </View>
                {history.map( (bilhete, index) => (
                    bilhete.nmpromocao === item.nmpromocao
                        ? (
                            <View style={styles.column} key={index}>
                                <View style={styles.row}>
                                    <Image 
                                        source={require('../../assets/images/icon-premio-of.png')}
                                        resizeMode='contain'
                                        style={{ 
                                            width: 20, 
                                            height: 20,
                                            ...(tickets.map(raf => bilhete.cdbilhete === raf.cdbilhete ? {color: COLORS.primaryColor} : {color: COLORS.lightColor})) 
                                        }}
                                    />
                                    <Text 
                                        style={{ 
                                            flex: 1,
                                            ...(moment(m).isAfter(item.dtfim)) ? {...styles.grayText} : {} 
                                        }}
                                    >
                                        {bilhete.cdbilhete}
                                    </Text>
                                    <Text 
                                        style={{ 
                                            ...(moment(m).isAfter(item.dtfim)) ? {...styles.grayText} : {} 
                                        }}
                                    >
                                        {moment(bilhete.dtbilhete).format('DD/MM/YYYY - hh:mm')}
                                    </Text>
                                </View>
                            </View>
                        )
                        : null
                ))}
            </View>
        )
    }

    return (
        <Container>
            <NavigationEvents 
                onDidFocus={ payload =>  handleHistory() }
            />
            <Appbar.Header style={[globalStyles.appbar]}>
                <Appbar.Content 
                    title='Meus Bilhetes'
                    style={{ alignItems: 'center', justifyContent: 'center' }}
                />                    
            </Appbar.Header>
            
            <View style={globalStyles.loadingContainer}>
                <ActivityIndicator size='large' animating={loading}/>
            </View>
            <FlatList 
                contentContainerStyle={styles.flatContentContainer}
                style={styles.flatContainer}
                data={contests}
                renderItem={ ({item}) => <Item item={item} />  }
                keyExtractor={(Item, index) => index}
                onRefresh={handleRefresh}
                refreshing={refreshing}
                onScroll={({nativeEvent}) => {
                    if(isCloseToBottom(nativeEvent)) {
                        handleCallPagination()
                    }
                }}
                scrollEventThrottle={1000}
            />
            
        </Container>
    )
}

const styles = StyleSheet.create({
    flatContainer: {
        flex: 1,
        padding: 20
    },
    flatContentContainer: {
        paddingBottom: 35
    },
    cardContainer: {
        flexGrow: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 2,
        marginTop: 10,
        padding: 15
    },
    row: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'flex-start',
        marginVertical: 3
    },
    column: {
        flexDirection: 'column', 
        alignItems: 'flex-start', 
        justifyContent: 'flex-start'
    },
    cardTitle: {
        fontSize: 22,
    },
    cardSubtitle: {
        fontSize: 14,  
    },
    grayText: {
        color: COLORS.mediumGray
    },
    boldText: {
        fontWeight: 'bold',
    },
    cardText: {
        color: COLORS.primaryColor, 
        fontSize: 22,
        marginLeft: 10
    },
})

const mapStateToProps = state => ({
    contests: state.contestState.contests.elementos,
    tickets: state.ticketState.tickets,
    history: state.ticketState.history,
    loading: state.ticketState.loading
})

const mapDispatchToProps = dispatch => bindActionCreators({
    getAllWinners: (pagination) => ticketActions.getAll(pagination),
    getHistory: (pagination) => ticketActions.getHistory(pagination)
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Tickets)
