import moment from "moment"
import {
  actionPayload,
  dataActionTypes,
  dataRow,
  filter,
  iDataReducerState,
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

const initialState: iDataReducerState = {

  dataFiltred: [],
  data: [],
  tags: [],
  typesTask: [],
  filter: { ...initialStateFilter },
  priorites: [],
  projects: [],
  statuses: [],
  dataTimeline: [],
  TimeLineStatuses: [],

}

export const dataReducer = (state = initialState, action: actionPayload) => {
  switch (action.type) {
    case dataActionTypes.SET_DATA:
      return { ...state, data: action.payload }
    case dataActionTypes.SET_DATAFILTRED:
      const data: Array<dataRow> = []
      action.payload.forEach((element: dataRow): void => {
        if (
          !data.some(
            (e: dataRow) => {
              return e.idBloker === element.idBloker && e.id === element.id
            }
          )
        ) {
          data.push(element)
        }
      })
      return { ...state, data, dataFiltred: FilteringData(data, state.filter) }
    case dataActionTypes.SET_TAGS:
      return { ...state, tags: action.payload }
    case dataActionTypes.SET_STATUSES:
      return { ...state, statuses: action.payload }
    case dataActionTypes.SET_PRIORITES:
      return { ...state, priorites: action.payload }
    case dataActionTypes.SET_TYPESTASK:
      return { ...state, typesTask: action.payload }
    case dataActionTypes.SET_PROJECTS:
      return { ...state, projects: action.payload }
    case dataActionTypes.SET_TIMELINEDATA:
      return { ...state, dataTimeline: action.payload }
    case dataActionTypes.CLEAR_DATAJSON:
      return { ...state, dataFiltred: [], data: [] }
    case dataActionTypes.SET_FILTER:
      return {
        ...state,
        filter: action.payload,
        dataFiltred: FilteringData(state.data, action.payload),
      }
    case dataActionTypes.SET_TIMELINEDATA_STATUSES:
      return {
        ...state,
        TimeLineStatuses: action.payload,
      }
    case dataActionTypes.CLEAR_FILTER:
      return {
        ...state,
        filter: { ...initialStateFilter },
        dataFiltred: state.data.slice(),
      }
    case dataActionTypes.CLEAN:
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
