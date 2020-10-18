
import { api } from './api'
import AsyncStorage from '@react-native-community/async-storage'

export const ticketService = {
    getRaffledTickets,
    getTicketsHistory,
    buyTicket
}

/**
 * Retorna o histórico de bilhetes, ordenado por páginas.
 * 
 * @param {string} pagination 
 */
async function getTicketsHistory(pagination) {
    const token = await AsyncStorage.getItem('token')
    const user = await AsyncStorage.getItem('userData')
    const _user = JSON.parse(user)
    let request = {
        cdemissora: _user.cdemissora,
        cdcliente: _user.cdcliente,
        tipo: 'BILHETECONSULTARHIST',
        pagina: pagination,
        payment: {
            token: token
        }
    }
    // console.log('tickets history: ', request)
    const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'aplication/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        }
    
    const response = await fetch(`${api}/bilhete`, requestOptions);
    const resp = await handleResponse(response);
    return resp;
}

/**
 * Retorna todos os bilhetes sorteados, ordenado por páginas.
 * 
 * @param {number} pagination
 */
async function getRaffledTickets(pagination) {
    const token = await AsyncStorage.getItem('token')
    const user = await AsyncStorage.getItem('userData')
    const _user = JSON.parse(user)
    let request = {
        cdemissora: _user.cdemissora,
        tipo: 'BILHETECONSULTAPREMIOS',
        pagina: pagination,
        payment: {
            token: token
        }
    }
    const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'aplication/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        }
    
    const response = await fetch(`${api}/bilhete`, requestOptions);
    const resp = await handleResponse(response);
    return resp;
}

/**
 * Recebe os dados da compra do bilhete.
 * cdemissora, cdpromocao, cdcliente, cdura, cardcli, vlbilhete, qtdbilhete, vlbilhetetotal, token.
 * 
 * @param {object} ticket 
 */
async function buyTicket(ticket) {
    let request = {
        cdemissora: ticket.cdemissora, 
        cdpromocao: ticket.cdpromocao, 
        tipo: "COMPRARBILHETE", 
        cdcliente: ticket.cdcliente,
        customerid: ticket.customerid,
        cdura: ticket.cdura,
        vlbilhete: ticket.vlbilhete.toString(),
        qtdbilhete: ticket.qtdbilhete.toString(),
        vlbilhetetotal: ticket.vlbilhetetotal,
        payment: {
            token: ticket.token 
        }
    }
    const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'aplication/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        }
    
    const response = await fetch(`${api}/bilhete`, requestOptions);
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
