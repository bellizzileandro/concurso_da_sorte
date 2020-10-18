
import { ticketTypes } from '../types'

const initialState = {
    loading: false,
    tickets: [],
    history: [],
    error: null,
    message: null,
}

export const ticketReducer = (state = initialState, action) => {
    switch(action.type) {
        case ticketTypes.GET_REFFLED_REQUEST:
        case ticketTypes.GET_HISTORY_REQUEST:
            return {
                ...state,
                loading: true,
            }
        case ticketTypes.GET_REFFLED_SUCCESS:
            let elements = []
            if(state.tickets.length > 0) {
                var items = []
                state.tickets.map( item => {
                    items.push(item.cdbilhete)
                })
                if(action.payload.length > 0) {
                    action.payload.map( el => {
                        if(!items.includes(el.cdbilhete)) {
                            state.tickets.push(el)
                        }
                    })
                    elements = orderList(state.tickets)
                }
            } else {
                elements = orderList(action.payload)
            }
            // console.log('elements saida: ', elements)
            return {
                ...state,
                tickets: elements,
                loading: false,
            }
        case ticketTypes.GET_HISTORY_SUCCESS:
            let _elements = []
            if(state.history.length > 0) {
                var _items = []
                state.history.map( item => {
                    _items.push(item.cdbilhete)
                })
                if(action.payload.length > 0) {
                    action.payload.map( el => {
                        if(!_items.includes(el.cdbilhete)) {
                            state.history.push(el)
                        }
                    })
                    _elements = orderList(state.history)
                }
            } else {
                _elements = orderList(action.payload)
            }
            return {
                ...state,
                history: _elements,
                loading: false,
            }
        case ticketTypes.GET_REFFLED_FAILURE:
        case ticketTypes.GET_HISTORY_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            }
        default:
            return state
    }
}

/** 
 * Ordena em ordem decrescente de data de sorteio os bilhetes antes de montar a exibição 
 * 
 */
function orderList(data) {
    var _data = data.sort((a, b) => {
        return (a.dtsorteio < b.dtsorteio) - (a.dtsorteio > b.dtsorteio)
    })

    return _data
}
