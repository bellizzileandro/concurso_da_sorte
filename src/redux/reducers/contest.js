
import { contestTypes } from '../types'

const initialState = {
    contests: [],
    activeContest: [],
    error: null,
}

export const contestReducer = (state = initialState, action) => {
    switch(action.type) {
        case contestTypes.CONTESTS_REQUEST:
        case contestTypes.ACTIVE_CONTEST_REQUEST:
        case contestTypes.CONTEST_PAYMENTS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null
            }
        case contestTypes.CONTESTS_SUCCESS:
            return {
                ...state,
                loading: false,
                contests: action.payload,
                error: null,
            }
        case contestTypes.ACTIVE_CONTEST_REQUEST:
            return {
                ...state,
                loading: false,
                activeContest: action.payload,
                error: null,
            }
        case contestTypes.CONTEST_PAYMENTS_REQUEST:
            return {
                ...state,
                loading: false,
                paymentsData: action.payload,
                error: null,
            }
        case contestTypes.CONTESTS_FAILURE:
        case contestTypes.ACTIVE_CONTEST_FAILURE:
        case contestTypes.CONTEST_PAYMENTS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload,
            }
        default:
            return state
    }
}
