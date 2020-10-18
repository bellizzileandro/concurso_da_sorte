
import { loggerMiddleware } from './logger'
import { thunkMid } from './thunk'

export const middlewares = [
    thunkMid,
    loggerMiddleware
]
