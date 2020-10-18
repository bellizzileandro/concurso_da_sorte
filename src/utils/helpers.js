/**
 * Módulo contendo funções auxiliares diversas.
 * 
 * @author Leandro Bellizzi
 */

import React from 'react'
import moment from 'moment'
import 'moment/locale/br'

/**
 * Formata o celular para a máscara (DDD) 99999 9999.
 * 
 * @param {string} celphone 
 */
export function formatCelphone(celphone) {
    let ddd = celphone.substring(0,2)
    let phone1 = celphone.substring(2, 7)
    let phone2 = celphone.substring(7, 11)
    return `(${ddd}) ${phone1} ${phone2}`
}

/**
 * Retorna o formato do celular para ddd999999999.
 * 
 * @param {string} celphone 
 */
export function unformatCelphone(celphone) {
    return celphone.replace('(', '').replace(')', '').replace(' ', '').replace(' ', '').replace(' ', '')
}

/**
 * Retorna o número do cartão sem espaços.
 * 
 * @param {string} cardNumber 
 */
export function unformatCreditCard(cardNumber) {
    return cardNumber.replace(' ', '').replace(' ', '').replace(' ', '')
}

/**
 * Retorna o formato do cpf para 99999999999.
 * 
 * @param {string} cpf 
 */
export function unformatCpf(cpf) {
    return cpf.replace('.', '').replace('.', '').replace('-', '')
}

/**
 * Formata o celular para máscara contendo código do país.
 * Exemplo: 5521998765432
 * 
 * @param {string} code 
 * @param {string} celphone 
 */
export function formatCelphoneWithCode(code, celphone) {
    let ddd = celphone.substring(0,2)
    let phone1 = celphone.substring(2, 7)
    let phone2 = celphone.substring(7, 11)
    let _code = code.replace('+', '')
    return `${_code}${ddd}${phone1}${phone2}`
}

/**
 * Retorna o CPF na máscara 999.999.999-99
 * 
 * @param {string} cpf 
 */
export function formatCpf(cpf) {
    return `${cpf.substring(0,3)}.${cpf.substring(3,6)}.${cpf.substring(6,9)}-${cpf.substring(9,11)}`
}

/**
 * Retorna string da data no formato americano YYYY/MM/DD
 * 
 * @param {string} date 
 */
export function resetBirthdate(date) {
    if (date != null && date.length === 10) {
        let arrDate = date.split('/')
        let d = new Date(parseInt(arrDate[2], 10), parseInt(arrDate[1], 10) - 1, parseInt(arrDate[0], 10))
        let _d = moment(d).format('YYYY/MM/DD')
        return _d
    }
}

/**
 * Retorna o nome sem caracteres especiais.
 * 
 * @param {string} text 
 */
export function formatCreditCardName(text) {
    let str = text.replace(/[ÀÁÂÃÄÅ]/g,"A")
            str = str.replace(/[àáâãäå]/g,"a")
            str = str.replace(/[éèê]/g,"e")
            str = str.replace(/[ÉÈ]/g,"E")
            str = str.replace(/[íï]/g,"I")
            str = str.replace(/[ÍÏ]/g,"i")
            str = str.replace(/[ÓÔÕ]/g,"O")
            str = str.replace(/[óôõö]/g,"i")
            str = str.replace(/[ÚÙÜ]/g,"U")
            str = str.replace(/[úùü]/g,"u")
            str = str.replace(/[Ç]/g,"C")
            str = str.replace(/[ç]/g,"c")

    return str
}
