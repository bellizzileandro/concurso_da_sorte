import { ticketTypes } from '../types'
import {
    request,
    success,
    failure
} from './action'
import { ticketService } from '../../services/tickets'

export const ticketActions = {
    getAll, 
    getHistory
}

/**
 * Emite a ação de requisição para os Tickets ganhadores.
 * Recebe como parâmetro paginação.
 * 
 * @param {number} pag 
 */
function getAll(pag) {
    return dispatch => {
        dispatch(request(ticketTypes.GET_REFFLED_REQUEST, {pagination: pag}))
        ticketService.getRaffledTickets(pag)
            .then( response => {
                if(response.idstatus === '1') {
                    dispatch(success(ticketTypes.GET_REFFLED_SUCCESS, response.elementos))
                } else {
                    dispatch(failure(ticketTypes.GET_REFFLED_FAILURE, response.dsstatus))
                }
            })
            .catch( error => {
                dispatch(failure(ticketTypes.GET_REFFLED_FAILURE, error))
            })
    }
}

/**
 * Emite a ação de requisição para o Histórico de tickets do cliente.
 * Recebe como parâmetro paginação.
 * 
 * @param {number} pag 
 */
function getHistory(pag) {
    return dispatch => {
        dispatch(request(ticketTypes.GET_HISTORY_REQUEST, {pagination: pag}))
        ticketService.getTicketsHistory(pag)
            .then( response => {
                if(response.idstatus === '1') {
                    dispatch(success(ticketTypes.GET_HISTORY_SUCCESS, response.elementos))
                } else {
                    dispatch(failure(ticketTypes.GET_HISTORY_FAILURE, response.dsstatus))
                }
            })
            .catch( error => {
                dispatch(failure(ticketTypes.GET_HISTORY_FAILURE, error))
            })
    }
}
