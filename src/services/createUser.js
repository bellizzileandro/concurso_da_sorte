import AsyncStorage from '@react-native-community/async-storage'
import { api, countryApi } from './api'
import { unformatCpf } from '../utils/helpers'

export const createUserService = {
    create,
    getCountries,
    sendSmsCode,
    sendSms,
}



/**
 * Confirma o código enviado para o celular do cliente.
 * 
 * @param {string} code 
 * @param {string} cell 
 */
async function sendSmsCode(code, cell) {
    let request = {
        tipo: 'CLIENTECONSULTARSMS',
        nrcelular: cell,
        cdemissora: "9",
        dssenha: code // '5400'
    }

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
    }

    const response = await fetch(`${api}/cliente`, requestOptions)
    const resp = await handleResponse(response)
    return resp
}

/**
 * Efetua a requisição do código de confirmação do celular do cliente.
 * 
 * @param {string} cell 
 */
async function sendSms(cell) {
    let request = { 
        tipo: 'CLIENTEENVIARSMS',
        nrcelular: cell, 
        cdemissora: "9"
    }
    
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
    }

    const response = await fetch(`${api}/cliente`, requestOptions)
    const resp = await handleResponse(response)
    return resp
}

/**
 * Requisição para API com os dados dos países.
 */
async function getCountries() {
    const requestOptions = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }

    const response = await fetch(countryApi, requestOptions)
    const resp = await handleResponse(response)
    return resp
}

/**
 * Realiza o cadastro para novo usuário.
 * 
 * @param {object} user 
 */
async function create(user) {
    let _cpf = unformatCpf(user.cpf)
    let request = {
        tipo: 'CLIENTECADASTRAR',
        nrcelular: user.nrcelular, 
        dttermoaceite: user.dttermoaceite, 
        dssenha: user.dssenha, 
        cdemissora: '9',  
        dsemail: user.dsemail, 
        dtnascimento: user.dtnascimento, 
        nmcliente: user.nmcliente, 
        nrcartao: user.nrcartao, 
        dtvalidadecartao: user.dtvalidadecartao, 
        nmcartao: user.nmcartao, 
        cpf: _cpf, 
        mobile: true, // só no caso de mobile, WEB_Pages não enviar. 
        dssenhasms: user.dssenhasms, // para WEB enviar código de SMS
        icccprefer:  '1' // user.icccprefer
    }
    console.log('create req: ', request)
    const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'aplication/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request)
        }
    
    const response = await fetch(`${api}/cliente`, requestOptions)
    const resp = await handleResponse(response)
    return resp
}

/**
 * Executa o tratamento das respostas.
 * 
 * @param {object} response 
 */
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
