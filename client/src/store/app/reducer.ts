import {
  actionPayload,
  appActionTypes,
  iAppReducerState,
  iNotification,
} from "./interface"

const initialState: iAppReducerState = {
  page: "/",
  errors: [],
  showFilter: false,
  spaces: [],
  notifications: [],
  accountData: {
    externalServiceType: '',
    externalServiceURL: '',
    name: '',
    login: '',
    password: ''
  }
}

export const appReducer = (state = initialState, action: actionPayload) => {
  switch (action.type) {
    case appActionTypes.ADD_NOTIFICATION:
      const notifications: iNotification[] = state.notifications.concat(action.payload)
      return { ...state, notifications }
    case appActionTypes.CLEAR_NOTIFICATIONS:
      return { ...state, notifications: [] }
    case appActionTypes.SET_SPACES:
      return { ...state, spaces: action.payload }
    case appActionTypes.SET_CURRENTSPACE:
      return { ...state, currentSpace: action.payload }
    case appActionTypes.CLEAN:
      return { ...initialState }
    case appActionTypes.SET_ACCOUNDDATA:
      return { ...state, accountData: action.payload }
    default:
      return state
  }
}