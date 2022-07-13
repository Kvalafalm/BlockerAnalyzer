import { dataActions } from "../data";
import { appActionTypes } from "./interface"

export const appActions = {

  pushError: (payload: any) => ({ type: appActionTypes.PUSH_ERROR, payload }),
  updateSpaces: (payload: any) => ({ type: appActionTypes.SET_SPACES, payload }),
  setCurrentSpace: (payload: any) => ({ type: appActionTypes.SET_CURRENTSPACE, payload }),
  clearErrors: () => ({ type: appActionTypes.CLEAR_ERRORS }),
  cleanReducer: () => ({ type: appActionTypes.CLEAN }),


  setCurrentSpaceAndUpdateData: (id: string) => async (dispatch: any) => {
    dispatch(dataActions.downloadBlockerListBySpace(id));
    dispatch(appActions.setCurrentSpace(id))
  },
  downloadSpaces: () => async (dispatch: any) => {
    const RequestUrl = `api/v1/space/list/`
    const headers = {
      "Content-Type": "application/json",
    }

    const options = {
      method: "GET",
      headers: headers,
    }

    try {
      const Response = await fetch(RequestUrl, options)
      const { result }: any = await Response.json()
      dispatch(appActions.updateSpaces(result))

    } catch (error) {
      console.log(error)
    }
  },

  downloadStartingDataFromServer: () => async (dispatch: any) => {
    dispatch(appActions.downloadSpaces())
  },

  /* downloadBlockerListBySpace: (id: string) => async (dispatch: any) => {

    const firstrequestUrl = `api/v1/blocker/list/` + id
    const headers = {
      "Content-Type": "application/json",
    }

    const options = {
      method: "GET",
      headers: headers,
    }

    try {
      const Response = await fetch(firstrequestUrl, options)
      const dataBlokers: any = await Response.json()
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

      dispatch(appActions.updateDataJson(dataJson))
    } catch (error) {
      console.log(error)
    }
  }, */
}