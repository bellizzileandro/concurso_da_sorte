import React from 'react'
import {
    StatusBar,
    SafeAreaView,
    ActivityIndicator
} from 'react-native'
import { connect } from 'react-redux'

import { globalStyles } from '../../utils'

function Container(props) {

    const { 
        children,
        appLoading,
        createUserLoading
    } = props

    let isLoading = appLoading || createUserLoading

    return (
        <>
            <StatusBar barStyle="light-content" />
            <SafeAreaView style={globalStyles.container}>
            {isLoading
                ? (<ActivityIndicator size="large" />)
                : children
            }
            </SafeAreaView>
        </>
    )
}


const mapStateToProps = state => ({
    appLoading: state.appState.isLoading,
    createUserLoading: state.createUserState.isLoading,
})

export default connect(mapStateToProps)(Container)
