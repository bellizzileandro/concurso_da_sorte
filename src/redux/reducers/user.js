
import { userTypes } from '../types'
import { formatCpf, formatCelphone } from '../../utils/helpers'

var initialState = {
    user: {},
    cards: [],
    error: null,
    loading: false,
    return: false
}

export const userReducer = (state = initialState, action) => {
    switch(action.type) {
        case userTypes.TURNOFF_RETURN:
            return {
                ...state,
                return: false
            }
        case userTypes.STORE_USER:
            return {
                ...state,
                user: action.payload
            }
        
        case userTypes.UPDATE_REQUEST:
        case userTypes.CARDSDATA_REQUEST:
            return {
                ...state,
                loading: true
            }
        case userTypes.CARDSDATA_SUCCESS:
            let elements = []
            if(state.cards.length > 0) {
                var items = []
                state.cards.map( item => {
                    items.push(item.cardcli)
                })
                if(action.payload.length > 0) {
                    action.payload.map( el => {
                        if(!items.includes(el.cardcli)) {
                            state.cards.push(el)
                        }
                    })
                    elements = state.cards
                }
            } else {
                elements = action.payload
            }
            return {
                ...state,
                loading: false,
                cards: elements
            }
        case userTypes.UPDATE_SUCCESS:
            return {
                ...state,
                loading: false,
                return: true
            }
        case userTypes.UPDATE_FAILURE:
        case userTypes.CARDSDATA_REQUEST:
            return {
                ...state,
                loading: false,
                error: action.payload
            }
        default:
            return state
    }
}

