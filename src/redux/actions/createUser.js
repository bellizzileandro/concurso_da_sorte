import { createUserTypes } from '../types'
import { createUserService } from '../../services/createUser'
import {
    request,
    success,
    failure
} from './action'

export const createUserActions = {
    create,
    getCountries,
    sendSms,
    store,
    storeSms,
    confirmSmsCode
}

function store(user) {
    return dispatch => {
        dispatch(request(createUserTypes.STORE_REQUEST, user))
        dispatch(success(createUserTypes.STORE_SUCCESS, user))
    }
}

function storeSms(code) {
    return dispatch => {
        dispatch(request(createUserTypes.STORE_SMS_REQUEST, code))
        dispatch(success(createUserTypes.STORE_SMS_SUCCESS, code))
    }
}

function sendSms(cell){
    return dispatch => {
        dispatch(request(createUserTypes.SENDSMS_REQUEST, cell))
        createUserService.sendSms(cell)
            .then( response => {
                if(response.idstatus === '1')
                    dispatch(success(createUserTypes.SENDSMS_SUCCESS, response))
                else
                    dispatch(failure(createUserTypes.SENDSMS_FAILURE, response))
            })
    }
}

function confirmSmsCode(code, cell){
    return dispatch => {
        dispatch(request(createUserTypes.CONFIRM_SMS_REQUEST, {code, cell}))
        createUserService.sendSmsCode(code, cell)
            .then( response => {
                if(response.idstatus === '1')
                    dispatch(success(createUserTypes.CONFIRM_SMS_SUCCESS, response))
                else
                    dispatch(failure(createUserTypes.CONFIRM_SMS_FAILURE, response))
            })
    }
}

function create(user) {
    return dispatch => {
        dispatch(request(createUserTypes.REGISTER_REQUEST, user))
        createUserService.create(user)
            .then( response => {
                if(response.idstatus === '1')
                    dispatch(success(createUserTypes.REGISTER_SUCCESS, response))
                else
                    dispatch(failure(createUserTypes.REGISTER_FAILURE, response))
            })
    }
}

function getCountries() {
    return dispatch => {
        dispatch(request(createUserTypes.COUNTRIES_REQUEST, null))
        createUserService.getCountries()
            .then( response => {
                dispatch(success(createUserTypes.COUNTRIES_SUCCESS, response))
            })
            .catch( error => {
                dispatch(failure(createUserTypes.COUNTRIES_FAILURE, error))
            })
    }
}


