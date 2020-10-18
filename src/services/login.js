import AsyncStorage from '@react-native-community/async-storage'
import { api } from './api'

export const loginService = {
    signin,
    signout,
    getUserDataByToken,
    getToken
}

async function getToken() {
    let request = {
        cdemissora: '9'
    }
    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'aplication/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
    }

    const response = await fetch(`${api}/emissora`, requestOptions);
    const resp = await handleResponse(response);
    return resp;
}

/**
 * Recebe um objeto user com os dados de E-mail para recuperar o token e prosseguir com o login.
 * @param {object} user 
 */
async function signin(user) {
    
    // console.log(user)
    let request = {
        cdemissora: '9',
        dsemail: user.email,
        dssenha: user.password,
        tipo: 'CLIENTECONSULTAR',
    }
    const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'aplication/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request)
        }
    
    const response = await fetch(`${api}/cliente`, requestOptions);
    const resp = await handleResponse(response);
    return resp;
}

/**
 * Recebe o objeto USER com os parâmetros CDEMISSORA, EMAIL e TOKEN, vindo da requisição de login com o CPF, e a senha informada pelo usuário.
 * @param {object} user 
 */
async function getUserDataByToken(user) {
    let emissora = user.cdemissora ? user.cdemissora : '9'
    let password = user.password ? user.password : user.dssenha
    let email = user.email ? user.email : user.dsemail
    // console.log(user)
    let request = {
        cdemissora: emissora,
        dsemail: email,
        tipo: 'CLIENTECONSULTARSENHA',
        dssenha: password,
        payment: {
            token: user.token
        }
    }
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

async function signout() {
    AsyncStorage.removeItem('user')
    AsyncStorage.removeItem('userToken')
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text)
        if(!response.ok){
            const error = (data && data.message)
            // console.log('login error: ', error)
            return Promise.reject(error)
        }

        return data
    })
}
