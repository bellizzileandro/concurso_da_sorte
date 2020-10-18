
import { api } from './api'
import AsyncStorage from '@react-native-community/async-storage'

export const contestService = {
    getAll,
    getActiveContestById,
    getMonthPayments
}

/**
 * Retorna todas as promoções ativas.
 */
async function getAll() {
    const token = await AsyncStorage.getItem('token')
    const user = await AsyncStorage.getItem('userData')
    const _user = JSON.parse(user)
    let request = {
        cdemissora: '9',// _user.cdemissora,
        tipo: 'CONSULTARPROMOCAOATIVA',
        cpf: '0',
        cdpromocao: '0',
        payment: {
            token: token
        }
    }
    const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'aplication/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(request)
        }
    
    const response = await fetch(`${api}/promocao`, requestOptions);
    const resp = await handleResponse(response);
    return resp;
}

/**
 * Retorna os dados da promoção ativa selecionada
 * 
 * @param {string} contestId 
 */
async function getActiveContestById(contestId) {
    const token = await AsyncStorage.getItem('token')
    const user = await AsyncStorage.getItem('userData')
    const _user = JSON.parse(user)
    let request = {
        cdemissora: _user.cdemissora,
        tipo: 'CONSULTARPROMOCAOATIVA',
        cpf: '0',
        cdpromocao: '0',
        payment: {
            token: token
        }
    }
    const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'aplication/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(request)
        }
    
    const response = await fetch(`${api}/promocao`, requestOptions);
    const resp = await handleResponse(response);
    return resp;
}

/**
 * Retornas todos os gastos realizados pelo usuário e se possui 
 * restrições de compra.
 * @param {string} cpf 
 */
async function getMonthPayments(cpf) {
    const token = await AsyncStorage.getItem('token')
    const user = await AsyncStorage.getItem('userData')
    const _user = JSON.parse(user)
    let request = {
        cdemissora: _user.cdemissora,
        tipo: 'CONSULTARPROMOCAOATIVA',
        cpf: cpf,
        cdpromocao: '0',
        payment: {
            token: token
        }
    }
    const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'aplication/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(request)
        }
    
    const response = await fetch(`${api}/promocao`, requestOptions);
    const resp = await handleResponse(response);
    return resp;
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text)
        if(!response.ok){
            const error = (data && data.message)
            return Promise.reject(error)
        }

        return data
    })
}
