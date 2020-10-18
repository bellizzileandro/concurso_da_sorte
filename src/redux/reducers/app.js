
import { appTypes } from '../types'

const initialState = {
    loading: false,
}

export const appReducer = (state = initialState, action) => {
    switch(action.type) {
        case appTypes.APP_LOADING:
            return {
                loading: action.payload,
            }        
        default:
            return state
    }
}
