import { combineReducers } from "redux"
import { appReducer } from "./app"
import { iAppReducerState } from "./app/interface"
import { dataReducer } from "./data"
import { iDataReducerState } from "./data/interface"
export const reducers = combineReducers({
  appReducer,
  dataReducer,
})

export type RootState = {
  appReducer: iAppReducerState,
  dataReducer: iDataReducerState,
}

export type RootState2 = ReturnType<typeof reducers>
