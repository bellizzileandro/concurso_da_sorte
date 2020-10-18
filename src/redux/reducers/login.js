
import { loginTypes } from '../types'

const initialState = {
    loading: false,
    user: [],
    error: null
}

export const loginReducer = (state = initialState, action) => {
    switch(action.type) {
        case loginTypes.LOGIN_REQUEST:
            return {
                loading: true,
                error: null
            }
        case loginTypes.LOGIN_SUCCESS:
            return {
                user: action.payload,
                loading: false,
                error: null
            }
        case loginTypes.LOGIN_FAILURE:
            return {
                loading: false,
                error: action.payload,
                user: []
            }
        default:
            return state
    }
}
