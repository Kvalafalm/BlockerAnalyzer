import {
  actionPayload,
  appActionTypes,
  iAppReducerState,
} from "./interface"

const initialState: iAppReducerState = {
  page: "/",
  errors: [],
  showFilter: false,
  spaces: [],
}

export const appReducer = (state = initialState, action: actionPayload) => {
  switch (action.type) {
    case appActionTypes.PUSH_ERROR:
      const errors: Array<any> = state.errors.slice()
      errors.push(action.payload)
      return { ...state, errors }
    case appActionTypes.CLEAR_ERRORS:
      return { ...state, errors: [] }
    case appActionTypes.SET_SPACES:
      return { ...state, spaces: action.payload }
    case appActionTypes.SET_CURRENTSPACE:
      return { ...state, currentSpace: action.payload }
    case appActionTypes.CLEAN:
      return { ...initialState }
    default:
      return state
  }
}