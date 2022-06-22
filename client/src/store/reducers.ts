import { combineReducers } from "redux"
import { appReducer } from "./app"

export const reducers = combineReducers({
  appReducer,
})

export type RootState = ReturnType<typeof reducers>
