
import React from 'react'
import { 
  ToastAndroid
} from 'react-native'

export function Toast(props) {
    const { 
        visible,
        message
    } = props

    if(visible) {
        ToastAndroid.showWithGravityAndOffset(
            message,
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
        )
        return null
    }
    return null
}  
