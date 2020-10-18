
import { createUserTypes } from '../types'

const initialState = {
    loading: false,
    user: {},
    registerStatus: {},
    smsStatus: {},
    countries: {},
    error: null,
    message: null,
    login: false
}

export const createUserReducer = (state = initialState, action) => {
    switch(action.type) {
        case createUserTypes.STORE_REQUEST:
        case createUserTypes.STORE_SMS_REQUEST:
        case createUserTypes.SENDSMS_REQUEST:
        case createUserTypes.CONFIRM_SMS_REQUEST:
        case createUserTypes.COUNTRIES_REQUEST:
        case createUserTypes.REGISTER_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case createUserTypes.STORE_SUCCESS:
            return {
                ...state,
                user: action.payload,
                loading: false,
                error: null
            }
        case createUserTypes.REGISTER_SUCCESS:
            return {
                ...state,
                registerStatus: action.payload,
                login: true,
                loading: false,
                error: null
            }
        case createUserTypes.CONFIRM_SMS_SUCCESS:
        case createUserTypes.SENDSMS_SUCCESS:
            return {
                ...state,
                smsStatus: action.payload,
                loading: false
            }
        case createUserTypes.STORE_SMS_SUCCESS:
            let _user = state.user
            _user.dssenhasms = action.payload
            return {
                ...state,
                user: _user,
                loading: false,
            }
        case createUserTypes.STORE_FAILURE:
        case createUserTypes.STORE_SMS_FAILURE:
        case createUserTypes.SENDSMS_FAILURE:
        case createUserTypes.COUNTRIES_FAILURE:
        case createUserTypes.REGISTER_FAILURE:
            return {
                ...state,
                loading: false,
                login: false,
                error: action.payload,
            }
        case createUserTypes.COUNTRIES_SUCCESS:
            return {
                ...state,
                loading: false,
                countries: action.payload
            }
        default:
            return state
    }
}
