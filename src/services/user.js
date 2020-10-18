
import { api } from './api'
import AsyncStorage from '@react-native-community/async-storage'

export const userService = {
    getUserByCpf,
    getCardsData,
    insertCard,
    getUserByEmailAndPassword,
    updatePassword,
    updateUser,
    changePreferCard,
    lostPassword,
    checkCpf,
    checkCardExists,
    checkEmail,
    refreshToken,
    resetPassword,
    getToken,
    checkCelphone,
    sendCpfCode,
    checkEmailCode
}

/**
 * Retorna o token para realizar novas requisições e os termos de uso e privacidade da emissora.
 */
async function getToken() {
    let request = {
        cdemissora: '9',
        tipo: 'CONSTARETK'
    }
    let requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'aplication/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
    }

    const response = await fetch(`${api}/emissora`, requestOptions);
    const resp = await handleResponse(response);
    return resp;
}

/**
 * Retorna as informações do cliente, enviando seu cpf
 * 
 * @param {string} cpf 
 */
async function getUserByCpf(cpf) {
    let request = {
        cdemissora: '9',
        cpf: cpf,
        tipo: 'CLIENTECONSULTAR',
    }
    let requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'aplication/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        }
    
    const response = await fetch(`${api}/cliente`, requestOptions);
    const resp = await handleResponse(response);
    return resp;
}

/**
 * Verifica se existe usuário para o CPF informado.
 * 
 * @param {string} cpf 
 */
async function checkCpf(cpf) {
    let request = {
        cdemissora: '9',
        cpf: cpf,
        tipo: 'CLIENTECPFCODE', 
    }
    const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'aplication/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        }
    
    const response = await fetch(`${api}/cliente`, requestOptions);
    const resp = await handleResponse(response);
    return resp;
}

/**
 * Verifica se existe usuário para o CPF informado.
 * 
 * @param {string} cpf 
 */
async function sendCpfCode(code) {
    let request = {
        cdemissora: '9',
        cdkey: code,
        tipo: 'CLIENTEENVCPFCODE', 
    }
    const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'aplication/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        }
    
    const response = await fetch(`${api}/cliente`, requestOptions);
    const resp = await handleResponse(response);
    return resp;
}

/**
 * Verifica se existe usuário para o CPF informado.
 * 
 * @param {string} cpf 
 */
async function checkEmailCode(code) {
    let request = {
        cdemissora: '9',
        cdkey: code,
        tipo: 'CLIENTECONSULTAREMAILCOD', 
    }
    console.log(request)
    const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'aplication/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        }
    
    const response = await fetch(`${api}/cliente`, requestOptions);
    console.log(response)
    const resp = await handleResponse(response);
    return resp;
}

/**
 * Verifica se existe usuário para o email informado.
 * 
 * @param {string} cpf 
 */
async function checkEmail(email) {
    let request = {
        cdemissora: '9',
        dsemail: email,
        tipo: 'CLIENTECONSULTAREMAIL'
    }
    console.log('checkemail request: ', request)
    const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'aplication/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        }
    
    const response = await fetch(`${api}/cliente`, requestOptions);
    const resp = await handleResponse(response);
    return resp;
}
/**
 * Verifica se existe usuário para o email informado.
 * 
 * @param {string} cpf 
 */
async function checkCelphone(celphone) {
    let request = {
        cdemissora: '9',
        nrcelular: celphone,
        tipo: 'CLIENTECONSULTARCELULAR'
    }
    const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'aplication/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        }
    
    const response = await fetch(`${api}/cliente`, requestOptions);
    const resp = await handleResponse(response);
    return resp;
}

/**
 * Retorna todos os cartões cadastrados pelo cliente.
 */
async function getCardsData() {
    const token = await AsyncStorage.getItem('token')
    const user = await AsyncStorage.getItem('userData')
    const _user = JSON.parse(user)
    let request = {
        cdemissora: _user.cdemissora,
        cdcliente: _user.cdcliente,
        tipo: 'CLIENTECONSULTARCARTAO',
        payment: {
            token: token
        }
    }
    console.log('getCardsData request: ', request)
    const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'aplication/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        }
    
    const response = await fetch(`${api}/cliente`, requestOptions);
    const resp = await handleResponse(response);
    return resp;
}

/**
 * Cadastra o novo cartão para o cliente.
 * 
 * @param {object} card 
 */
async function insertCard(card) {
    const token = await AsyncStorage.getItem('token')
    const user = await AsyncStorage.getItem('userData')
    const _user = JSON.parse(user)
    let request = {
        cdemissora: _user.cdemissora,
        cdcliente: _user.cdcliente,
        nrcartao: card.nrcartao,
        dtvalidadecartao: card.dtvalidadecartao,
        nmcartao: card.nmcartao,
        icccprefer: '1',
        tipo: 'CADASTRARCARTAO',
        payment: {
            token: token
        }
    }
    // console.log('insert card req: ', request)
    const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'aplication/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        }
    
    const response = await fetch(`${api}/cliente`, requestOptions);
    const resp = await handleResponse(response);
    return resp;
}

/**
 * Retorna os dados do cliente consultando email e password. 
 * Este não é o método de login.
 * 
 * @param {string} email 
 * @param {string} password 
 */
async function getUserByEmailAndPassword(email, password) {
    const token = await AsyncStorage.getItem('userToken')
    const user = await AsyncStorage.getItem('userData')
    const _user = JSON.parse(user)
    let request = {
        cdemissora: _user.cdemissora,
        dsemail: email,
        dssenha: password,
        tipo: 'CLIENTECONSULTARSENHA',
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
    
    const response = await fetch(`${api}/cliente`, requestOptions);
    const resp = await handleResponse(response);
    return resp;
}



/**
 * Altera a senha antiga.
 * 
 * @param {string} password 
 */
async function resetPassword(password, cdcliente, token) {
    let request = {
        cdemissora: '9',
        cdcliente: cdcliente,
        dssenha: password,
        tipo: 'CLIENTEALTERARSENHA',
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
    
    const response = await fetch(`${api}/cliente`, requestOptions);
    const resp = await handleResponse(response);
    return resp;
}

/**
 * Retorna se o email informado existe na base de dados.
 * 
 * @param {string} email 
 */
async function getUserByEmail(email) {
    const token = await AsyncStorage.getItem('userToken')
    let request = {
        cdemissora: '9',
        dsemail: email,
        tipo: 'CLIENTECONSULTAREMAIL',
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
    
    const response = await fetch(`${api}/cliente`, requestOptions);
    const resp = await handleResponse(response);
    return resp;
}

/**
 * Altera a senha antiga.
 * 
 * @param {string} password 
 */
async function updatePassword(password) {
    const token = await AsyncStorage.getItem('token')
    const user = await AsyncStorage.getItem('userData')
    const _user = JSON.parse(user)
    let request = {
        cdemissora: '9',
        cdcliente: _user.cdcliente,
        dssenha: password,
        tipo: 'CLIENTEALTERARSENHA',
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
    
    const response = await fetch(`${api}/cliente`, requestOptions);
    const resp = await handleResponse(response);
    return resp;
}

/**
 * Atualiza as informações do cliente.
 * 
 * @param {object} user 
 */
async function updateUser(user) {
    const token = await AsyncStorage.getItem('token')
    const password = await AsyncStorage.getItem('password')
    let email = user.dsemail ? user.dsemail : user.dsEmail
    user.payment.token = token
    user.dssenha = password
    user.dsemail = email
    // let request = {
    //     cdemissora: user.cdemissora,
    //     cdcliente: user.cdcliente,
    //     dssenha: password,
    //     nmcliente: user.nmcliente,
    //     nrcelular: user.nrCelular,
    //     dsemail: email,
    //     customerid: user.customerid,
    //     dtnascimento: user.dtnascimento,
    //     cpf: user.cpf,
    //     tipo: 'CLIENTEALTERARTK',
    //     payment: {
    //         token: token
    //     }
    // }
    console.log('updateUser request: ', request)
    const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'aplication/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        }
    
    const response = await fetch(`${api}/cliente`, requestOptions);
    const resp = await handleResponse(response);
    return resp;
}

/**
 * Altera o cartão preferencial cadastrado pelo cliente.
 * 
 * @param {object} card 
 */
async function changePreferCard(card) {
    const token = await AsyncStorage.getItem('token')
    const user = await AsyncStorage.getItem('userData')
    const _user = JSON.parse(user)
    let request = {
        cdemissora: _user.cdemissora,
        cdkey: card.cdkey,
        cdcliente: _user.cdcliente,
        nrfinalcartao: card.finalCard,
        dtvalidadecartao: card.dtvalidadecartao,
        nmcartao: card.nmcartao,
        nriniciocartao: card.initCard,
        icccprefer: '1',
        tipo: 'CARTAOPREFERENCIALALTERAR',
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
    
    const response = await fetch(`${api}/cliente`, requestOptions);
    const resp = await handleResponse(response);
    return resp;
}

/**
 * Verifica se o cartão existe no cadastro do cliente.
 * 
 * @param {object} card 
 */
async function checkCardExists(card) {
    const user = await AsyncStorage.getItem('userData')
    const _user = JSON.parse(user)
    const token = await AsyncStorage.getItem('token')
    let request = {
        cdemissora: _user.cdemissora,
        cdcliente: _user.cdcliente,
        nrfinalcartao: card.finalCard,
        nriniciocartao: card.initCard,
        tipo: 'CLICONSULTARCARTAOEXISTE',
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
    
    const response = await fetch(`${api}/cliente`, requestOptions);
    const resp = await handleResponse(response);
    return resp;
}

/**
 * Reenvia a senha para o usuário.
 * 
 * Recebe como parametro um objeto contendo email e token
 * 
 * @param {object} email 
 */
async function lostPassword(email) {
    let request = {
        cdemissora: "9",
        cdkey: email.cdkey,
        dsemail: email.email,
        tipo: 'CLIENTEESQUECEUSENHA',
        payment: {
            token: email.token
        }
    }
    console.log('lostPassword req: ', request)
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
 * Executa refresh no token do cliente logado
 */
async function refreshToken() {
    const token = await AsyncStorage.getItem('token')
    const _u = await AsyncStorage.getItem('userData')
    const user = JSON.parse(_u)
    const password = await AsyncStorage.getItem('password')
    const request = {
        cdemissora: user.cdemissora,
        dsemail: user.dsemail,
        dssenha: password,
        tipo: 'CLIENTECONSULTAR',
        payment: {
            token: token
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
