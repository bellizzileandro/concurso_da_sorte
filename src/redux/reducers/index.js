
import { combineReducers } from 'redux'

import { loginReducer } from './login'
import { createUserReducer } from './createUser'
import { appReducer } from './app'
import { contestReducer } from './contest'
import { ticketReducer } from './tickets'
import { userReducer } from './user'

const rootReducer = combineReducers({
    appState: appReducer,
    loginState: loginReducer,
    createUserState: createUserReducer,
    contestState: contestReducer,
    ticketState: ticketReducer,
    userState: userReducer
})

export default rootReducer
