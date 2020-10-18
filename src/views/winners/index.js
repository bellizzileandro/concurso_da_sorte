import React from 'react'
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Alert,
} from 'react-native'
import { 
    Appbar,
} from 'react-native-paper'
import { NavigationEvents } from 'react-navigation'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux' 
import Icon from 'react-native-vector-icons/Ionicons'
import moment from 'moment'

import Container from '../layout'
import { globalStyles, COLORS } from '../../utils'
import { ticketActions } from '../../redux/actions'

function Item({item}) {
    let date = moment(item.dtsorteio).format('DD/MM/YYYY')
    return (
        <View style={styles.cardContainer}>
            <View style={styles.row}>
                <Text style={[styles.cardTitle, styles.boldText]}>{item.nmpromocao}</Text>
            </View>
            <View style={styles.column}>
                <View style={styles.row}>
                    <Text>Data do sorteio: </Text>
                    <Text>{date}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.boldText}>Nº Bilhete: </Text>
                    <Text style={styles.boldText}>{item.cdbilhete}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.boldText}>Cel: </Text>
                    <Text style={styles.boldText}>{item.nrcelular}</Text>
                </View>
                <View style={styles.row}>
                    <Text>Região: </Text>
                    <Text>{item.nmcidadeganhador} - {item.nmufganhador}</Text>
                </View>
                <View style={styles.row}>
                    <Icon name='ios-star' color={COLORS.primaryColor} size={30} />
                    <Text style={[styles.cardText, styles.boldText]}>{item.dspremio}</Text>
                </View>
            </View>
        </View>
    )
}

function Winners(props) {

    var { 
        navigation,
        loading, 
        getAllWinners,
        tickets
    } = props

    var [refreshing, setRefreshing] = React.useState(false)
    var [pagination, setPagination] = React.useState(1)


    function handleCallPagination() {
        console.log('chamou pagination')
        var pag = pagination + 1
        console.log('pag', pag)
        setPagination(pag)
        getAllWinners(pag)
    }

    function handleWinners() {
        setPagination(1)
        getAllWinners(1)
    }

    const handleRefresh = () => {
        setRefreshing(true)
        getAllWinners(pagination)
        setRefreshing(false)
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
    
    return (
        <Container>
            <NavigationEvents 
                onDidFocus={payload => handleWinners()}
            />
            <Appbar.Header style={[globalStyles.appbar]}>
                <Appbar.Content 
                    title='Ganhadores'
                    style={{ alignItems: 'center', justifyContent: 'center' }}
                />                    
            </Appbar.Header>
            <View style={{ flexGrow: 1, alignItems: 'center', justifyContent: 'center'}}>
                <View style={globalStyles.loadingContainer}>
                    <ActivityIndicator size='large' animating={loading}/>
                </View>
                <FlatList 
                    contentContainerStyle={styles.flatContentContainer}
                    style={styles.flatContainer}
                    data={tickets}
                    renderItem={ ({item}) => <Item item={item} />  }
                    keyExtractor={(item, index) => index.toString()}
                    onScroll={({nativeEvent}) => {
                        if(isCloseToBottom(nativeEvent)) {
                            handleCallPagination()
                        }
                    }}
                    scrollEventThrottle={1000}
                    onRefresh={handleRefresh}
                    refreshing={refreshing}
                />
            </View>
            
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
        marginBottom: 15
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
    tickets: state.ticketState.tickets,
    loading: state.ticketState.loading
})

const mapDispatchToProps = dispatch => bindActionCreators({
    getAllWinners: (pagination) => ticketActions.getAll(pagination)
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Winners)
