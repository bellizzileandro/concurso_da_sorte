/**
 * Default function responsible for triggering and returning action requests
 * @param {string} req 
 * @param {json} resp 
 */
export function request(req, resp) {
    return {
        type: req,
        payload: resp
    }
}

/**
 * Default function responsible for triggering and returning the success of action requests
 * @param {string} req 
 * @param {json} resp 
 */
export function success(req, resp) {
    return {
        type: req,
        payload: resp
    }
}

/**
 * Default function responsible for triggering and returning error of action requests
 * @param {string} req 
 * @param {json} resp 
 */
export function failure(req, resp) {
    return {
        type: req,
        payload: resp
    }
}
