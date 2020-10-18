/**
 * Default global stylesheet
 */

import { StyleSheet } from 'react-native'

import { COLORS } from './palette'

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flexGrow: 1,
    },
    appbar:{
        backgroundColor: '#000000',
    },
    appTitle: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    centered: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    checkContainer: {
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    textInputContainer: {
        // borderBottomColor: COLORS.lightColor, 
        // borderBottomWidth: 1, 
        marginBottom: 5
    },
    topBar: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: '#000000',
    },
    text: {
        color: COLORS.lightColor,
    },
    textInput: {
        fontWeight: 'bold'
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
    loadingContainer: {
        position: 'absolute', 
        zIndex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        top: '50%', 
        left: '50%',
    },
})
