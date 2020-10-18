import { userTypes } from '../types'
import {
    request,
    success,
    failure
} from './action'
import { userService } from '../../services/user'

export const userActions = {
    updateUser,
    getCardsData,
    storeUser,
    turnOffReturn,
}

/**
 * Ação auxiliar para armazenar os dados do usuário e recarregar mais rapidamente os dados em tela.
 * 
 * @param {object} user 
 */
function storeUser(user) {
    return dispatch => {
        dispatch(success(userTypes.STORE_USER, user))
    }
}

/**
 * Ação auxiliar realizada após realizar goBack(), após o update.
 */
function turnOffReturn() {
    return dispatch => {
        dispatch(success(userTypes.TURNOFF_RETURN, null))
    }
}

function updateUser(user) {
    return dispatch => {
        dispatch(request(userTypes.UPDATE_REQUEST, user))
        userService.updateUser(user)
            .then( response => {
                if(response.idstatus === '1') {
                    dispatch(success(userTypes.UPDATE_SUCCESS, response))
                } else {
                    dispatch(failure(userTypes.UPDATE_FAILURE, response.dsstatus))
                }
            })
            .catch( error => {
                dispatch(failure(userTypes.UPDATE_FAILURE, error))
            })
    }
}

/**
 * Emite uma action para requisição dos dados dos cartões cadastrados do cliente.
 */
function getCardsData() {
    return dispatch => {
        dispatch(request(userTypes.CARDSDATA_REQUEST, null))
        userService.getCardsData()
            .then( response => {
                if(response.idstatus === '1') {
                    dispatch(success(userTypes.CARDSDATA_SUCCESS, response.elementos))
                } else {
                    dispatch(failure(userTypes.CARDSDATA_FAILURE, response.dsstatus))
                }
            })
            .catch( error => {
                dispatch(failure(userTypes.CARDSDATA_FAILURE, error))
            })
    }
}
