
import { applyMiddleware, createStore } from 'redux'
import rootReducer from '../reducers'
import { composeWithDevTools } from 'remote-redux-devtools'

import { middlewares } from '../middlewares'

const initialState = {}
const enhancers = []

const compose = composeWithDevTools({ 
    realtime: true, 
    port: 8000,
    hostname: "localhost" 
})



const composedEnhancers = compose(
    applyMiddleware(...middlewares),
    // Reactotron.createEnhancer(),
    ...enhancers
)

const store = createStore(
    rootReducer,
    initialState,
    composedEnhancers
)

export default store
