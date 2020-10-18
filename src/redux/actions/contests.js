import { contestTypes } from '../types'
import {
    request,
    success,
    failure
} from './action'
import { contestService } from '../../services/contest'

export const contestActions = {
     getAll,
     getActiveContestById,
     getMonthPayments
}

function getAll() {
    return dispatch => {
        dispatch(request(contestTypes.CONTESTS_REQUEST, null))
        contestService.getAll()
            .then( response => {
                dispatch(success(contestTypes.CONTESTS_SUCCESS, response))
            })
            .catch( error => {
                dispatch(failure(contestTypes.CONTESTS_FAILURE, error))
            })
    }
}

function getActiveContestById(contestId) {
    return dispatch => {
        dispatch(request(contestTypes.ACTIVE_CONTEST_REQUEST, cpf))
        contestService.recovery(contestId)
            .then( response => {
                dispatch(success(contestTypes.ACTIVE_CONTEST_SUCCESS, response))
            })
            .catch( error => {
                dispatch(failure(contestTypes.ACTIVE_CONTEST_FAILURE, error))
            })
    }
}

function getMonthPayments(cpf) {
    return dispatch => {
        dispatch(request(contestTypes.CONTEST_PAYMENTS_REQUEST, cpf))
        contestService.getMonthPayments(cpf)
            .then( response => {
                dispatch(success(contestTypes.CONTEST_PAYMENTS_SUCCESS, response))
            })
            .catch( error => {
                dispatch(failure(contestTypes.CONTEST_PAYMENTS_FAILURE, error))
            })
    }
}
