import React from 'react'
import moment from 'moment'
import 'moment/locale/br'

export const validation = {
    fullName,
    email,
    cpf,
    password,
    dateIsValid,
    validOlderAge
}

/**
 * Valida se a string é uma data válida.
 * Retorna boolean.
 * 
 * @param {string} date 
 */
function dateIsValid(date) {
    let arrDate = date.split('/')
    let d = moment([parseInt(arrDate[2], 10), parseInt(arrDate[1], 10)-1, parseInt(arrDate[0], 10)])
    return d.isValid()
}

/**
 * Valida se a data informada é 18+.
 * Retorna boolean.
 * 
 * @param {string} date 
 */
function validOlderAge(date) {
    let arrDate = date.split('/')
    let d = moment([parseInt(arrDate[2], 10), parseInt(arrDate[1], 10)-1, parseInt(arrDate[0], 10)])
    let now = moment()
    let _diff = now.diff(d, 'years')
    console.log(_diff >= 18)
    return (_diff >= 18 && _diff <=100)
}

function fullName(name) {
    let re = /^[a-zA-Z ]+$/
    return re.test(name)
}

function email(email) {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email);
}

function cpf(cpf) {
    let re = /(^\d{3}\.\d{3}\.\d{3}\-\d{2}$)/
    return re.test(cpf);
}

function password(text) {
    let re = /^(?=.*[@!#$%^&*()/\\])[@!#$%^&*()/\\a-zA-Z0-9]{6,20}$/
    return re.test(text)
}
