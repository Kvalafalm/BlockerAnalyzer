import moment, { Moment } from "moment"
import { dataActionTypes, dataFiltredRow } from "./interface"

export const dataActions = {
  setData: (payload: any) => {
    type: dataActionTypes.SET_DATA, payload
  },
  setSwithcFilter: (payload: any) => ({
    type: dataActionTypes.SWITCH_FILTER,
    payload,
  }),
  setPage: (payload: any) => ({ type: dataActionTypes.SET_PAGE, payload }),
  setTags: (payload: any) => ({ type: dataActionTypes.SET_TAGS, payload }),
  setPriorites: (payload: any) => ({
    type: dataActionTypes.SET_PRIORITES,
    payload,
  }),
  setTypesTask: (payload: any) => ({
    type: dataActionTypes.SET_TYPESTASK,
    payload,
  }),
  setProjects: (payload: any) => ({
    type: dataActionTypes.SET_PROJECTS,
    payload,
  }),
  setStatuses: (payload: any) => ({
    type: dataActionTypes.SET_STATUSES,
    payload,
  }),
  setTimelineData: (payload: any) => ({
    type: dataActionTypes.SET_TIMELINEDATA,
    payload,
  }),
  setTimelineDataStatuses: (payload: any) => ({
    type: dataActionTypes.SET_TIMELINEDATA_STATUSES,
    payload,
  }),
  addDataJson: (payload: any) => ({
    type: dataActionTypes.ADD_DATAJSON,
    payload,
  }),
  pushError: (payload: any) => ({ type: dataActionTypes.PUSH_ERROR, payload }),
  setFilter: (payload: any) => ({ type: dataActionTypes.SET_FILTER, payload }),
  clearFilter: () => ({ type: dataActionTypes.CLEAR_FILTER }),
  clearErrors: () => ({ type: dataActionTypes.CLEAR_ERRORS }),

  clearDataJson: () => ({ type: dataActionTypes.CLEAR_DATAJSON }),
  cleanReducer: () => ({ type: dataActionTypes.CLEAN }),

  updateDataJson: (data: Array<dataFiltredRow>) => async (dispatch: any) => {
    const newArrayOfTags: Array<string> = []
    const newProjects: Array<string> = []
    const newTypesTask: Array<string> = []
    const arrayOfPriorites: Array<string> = []
    let tagsAll: Array<string> = []
    let typesTask: Array<string> = []
    const projects: Array<string> = []
    const priorites: Array<string> = []
    const statuses: Array<string> = []
    const newStatuses: Array<string> = []
    for (const element of data) {
      element.time = calculateDifference(element.start, element.end)
    }

    dispatch(dataActions.addDataJson(data))

    data.forEach((element: dataFiltredRow) => {
      if (element.tags.length > 0) {
        tagsAll = tagsAll.concat(element.tags)
      }
      projects.push(element.project)
      statuses.push(element.status)
      typesTask.push(element.typeIssue)
      arrayOfPriorites.push(element.priority)
    })

    for (let str of tagsAll) {
      if (!newArrayOfTags.includes(str)) {
        newArrayOfTags.push(str)
      }
    }
    dispatch(dataActions.setTags(newArrayOfTags))

    for (let str of statuses) {
      if (!newStatuses.includes(str)) {
        newStatuses.push(str)
      }
    }
    dispatch(dataActions.setStatuses(newStatuses))

    for (let str of typesTask) {
      if (!newTypesTask.includes(str)) {
        newTypesTask.push(str)
      }
    }

    dispatch(dataActions.setTypesTask(newTypesTask))

    for (let str of projects) {
      if (!newProjects.includes(str)) {
        newProjects.push(str)
      }
    }
    dispatch(dataActions.setProjects(newProjects))

    for (let str of arrayOfPriorites) {
      if (!priorites.includes(str)) {
        priorites.push(str)
      }
    }
    dispatch(dataActions.setPriorites(priorites))
  },
  getInfoForTimeLine: (data: string, row: any) => async (dispatch: any) => {
    const rowsString = `&subtasks=${row.subtasks}&blockers=${row.blockers}&worklogs=${row.worklogs}`
    const requestUrl = `api/v1/issue/${data}?${rowsString}`
    const headers = {
      "Content-Type": "application/json",
      /* Authorization: `Basic ${config.get('base64')}`, */
    }
    const options = {
      method: "GET",
      headers: headers,
    }

    try {
      const response = await fetch(requestUrl, options)
      const { result } = await response.json()
      const statuses = prepareStatuses(result.statusLog)
      dispatch(dataActions.setTimelineData(result.timelinedata))
      dispatch(dataActions.setTimelineDataStatuses(statuses))
    } catch (error) {
      console.log(error)
    }
  },
  downloadDataFromServer: () => async (dispatch: any) => {
    const firstrequestUrl = `api/v1/blocker/list/`
    const secondRequestUrl = `api/v1/projects/list/`
    const headers = {
      "Content-Type": "application/json",
      /* Authorization: `Basic ${config.get('base64')}`, */
    }

    const options = {
      method: "GET",
      headers: headers,
    }

    try {
      const firstResponse = await fetch(firstrequestUrl, options)
      const secondResponse = await fetch(secondRequestUrl, options)
      const dataProjectList: any = await secondResponse.json()
      alert(dataProjectList)
      const dataBlokers: any = await firstResponse.json()
      const dataJson: any = await Object.values(dataBlokers.result)

      for (const element of dataJson) {
        if (element.tags) {
          element.tags = Object.values(element.tags)
        }
        if (element.start) {
          element.start = moment(element.start)
        }
        if (element.end) {
          element.end = moment(element.end)
        }

        element.time = calculateDifference(element.start, element.end)
      }

      dispatch(dataActions.updateDataJson(dataJson))
    } catch (error) {
      console.log(error)
    }
  },
}

const prepareStatuses = (payload: any) => {
  const statuses = []
  let id = 0
  for (const iterator of payload) {
    const end = iterator.end ? moment(iterator.end) : moment()
    const start = moment(iterator.start)
    statuses.push({
      ...iterator,
      id,
      start,
      end,
      time: calculateDifference(start, end),
    })
    id++
  }
  return statuses
}

const calculateDifference = (
  start: Moment | null,
  end: Moment | null
): number => {
  if (!start) {
    return 0
  }

  let difference = 0
  if (end) {
    difference = end.diff(start) / (24 * 3600 * 1000)
  } else {
    difference = moment().diff(start) / (24 * 3600 * 1000)
  }

  return Math.round(difference)
}
