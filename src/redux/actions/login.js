
import { loginTypes } from '../types'
import { loginService } from '../../services/login'
import {
    request,
    success,
    failure
} from './action'

export const loginActions = {
    signin,
    signout
}

function signin(user) {
    return dispatch => {
        dispatch(request(loginTypes.LOGIN_REQUEST, user))
        loginService.login(user)
            .then( response => {
                dispatch(success(loginTypes.LOGIN_SUCCESS, response))
            })
            .catch( error => {
                dispatch(failure(loginTypes.LOGIN_FAILURE, error))
            })
    }
}

function signout() {
    return dispatch => {
        dispatch(request(loginTypes.LOGOUT_REQUEST))
        loginService.signout()
            .then( response => {
                dispatch(success(loginTypes.LOGOUT_REQUEST, response))
            })
            .catch( error => {
                dispatch(failure(loginTypes.LOGOUT_FAILURE, error))
            })
    }
}
