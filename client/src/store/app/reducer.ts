import moment from "moment"
import {
  actionPayload,
  appActionTypes,
  dataJsonRow,
  dataRow,
  filter,
} from "./interface"

const initialStateFilter: filter = {
  priorites: [],
  start: null,
  end: null,
  statuses: [],
  projects: [],
  typesTask: [],
  tags: [],
}

const initialState = {
  dataJson: [],
  dataPure: null,
  tags: [],
  typesTask: [],
  page: "/",
  errors: [],
  showFilter: false,
  filter: { ...initialStateFilter },
  projects: [],
  data: [],
  dataTimeline: [],
}

export const appReducer = (state = initialState, action: actionPayload) => {
  switch (action.type) {
    case appActionTypes.SET_DATA:
      return { ...state, dataPure: action.payload }
    case appActionTypes.ADD_DATAJSON:
      const dataJson: Array<dataJsonRow> = state.dataJson.slice()
      action.payload.forEach((element: dataJsonRow): void => {
        if (
          !dataJson.some(
            (e: dataJsonRow) =>{
              return e.idBloker === element.idBloker && e.id === element.id
            }
          )
        ) {
          dataJson.push(element)
        }
      })
      return { ...state, dataJson, data: FilteringData(dataJson, state.filter) }
    case appActionTypes.SET_TAGS:
      return { ...state, tags: action.payload }
    case appActionTypes.SET_STATUSES:
      return { ...state, statuses: action.payload }
    case appActionTypes.SET_PRIORITES:
      return { ...state, priorites: action.payload }
    case appActionTypes.SET_TYPESTASK:
      return { ...state, typesTask: action.payload }
    case appActionTypes.SET_PROJECTS:
      return { ...state, projects: action.payload }
    case appActionTypes.SET_PAGE:
      return { ...state, page: action.payload }
    case appActionTypes.PUSH_ERROR:
      const errors: Array<any> = state.errors.slice()
      errors.push(action.payload)
      return { ...state, errors }
    case appActionTypes.CLEAR_ERRORS:
      return { ...state, errors: [] }
    case appActionTypes.SET_TIMELINEDATA:
      return { ...state, dataTimeline: action.payload }
    case appActionTypes.SWITCH_FILTER:
      return { ...state, showFilter: action.payload }
    case appActionTypes.CLEAR_DATAJSON:
      return { ...state, dataJson: [], dataPure: null }
    case appActionTypes.SET_FILTER:
      return {
        ...state,
        filter: action.payload,
        data: FilteringData(state.dataJson, action.payload),
      }
    case appActionTypes.SET_TIMELINEDATA_STATUSES:
      return {
        ...state,
        TimeLineStatuses: action.payload,
      }
    case appActionTypes.CLEAR_FILTER:
      return {
        ...state,
        filter: { ...initialStateFilter },
        data: state.dataJson.slice(),
      }
    case appActionTypes.CLEAN:
      return { ...initialState }
    default:
      return state
  }
}

const FilteringData = (data: any, filter: any) => {
  if (filter === undefined) {
    return data
  }
  if (!Array.isArray(data) || data.length === 0) {
    return data
  }

  const newArray: Array<any> = data.filter(element => {
    return checkElement(element, filter)
  })

  return newArray
}
const checkElement = (element: dataRow, filter: filter) => {
  let passElement = true
  const date = moment(element.start)
  const startDate = filter?.start ?? new Date(1990, 0, 0)
  const endDate = filter?.end ?? new Date(2990, 0, 0)

  if (!date.isBetween(startDate, endDate)) {
    passElement = false
  }

  if (filter?.priorites?.length > 0) {
    if (!filter?.priorites?.includes(element.priority.toString())) {
      passElement = false
    }
  }
  if (filter?.projects?.length > 0) {
    if (!filter?.projects?.includes(element.project)) {
      passElement = false
    }
  }

  if (filter?.statuses?.length > 0) {
    if (!filter?.statuses?.includes(element.status)) {
      passElement = false
    }
  }

  if (filter?.typesTask?.length > 0) {
    if (!filter?.typesTask?.includes(element.typeIssue)) {
      passElement = false
    }
  }
  if (filter?.tags?.length > 0) {
    element.tags.forEach(tag => {
      if (!filter?.tags?.includes(tag)) {
        passElement = false
      }
    })
  }

  return passElement
}
