import { appTypes } from '../types'
import {
    request,
} from './action'

export const appActions = {
    loading
}

function loading(isLoading) {
    return dispatch => {
        dispatch(request(appTypes.APP_LOADING, isLoading))
    }
}
