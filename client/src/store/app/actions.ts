import moment from "moment";
import { dataActions } from "../data";
import { appActionTypes, IUpdateRequest, ISpace } from "./interface"

export const appActions = {

  pushError: (payload: any) => ({ type: appActionTypes.PUSH_ERROR, payload }),
  updateSpaces: (payload: Array<ISpace>) => ({ type: appActionTypes.SET_SPACES, payload }),
  setCurrentSpace: (payload: ISpace) => ({ type: appActionTypes.SET_CURRENTSPACE, payload }),
  clearErrors: () => ({ type: appActionTypes.CLEAR_ERRORS }),
  cleanReducer: () => ({ type: appActionTypes.CLEAN }),


  setCurrentSpaceAndUpdateData: (space: ISpace) => async (dispatch: any) => {
    dispatch(dataActions.downloadBlockerListBySpace(space.id));
    dispatch(appActions.setCurrentSpace(space))
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

  updateImportBLockers: (space: ISpace) => async (dispatch: any) => {

    const firstrequestUrl = `api/v1/ImportData/periodAsync`
    const headers = {
      "Content-Type": "application/json",
    }
    if (!space.lastRequest?.EndDate) {
      return false
    }

    const body: IUpdateRequest = {
      idboard: space.externalId,
      StartDate: moment(space.lastRequest?.EndDate).format("YYYY-MM-DD") ?? '1990-00-00',
      EndDate: moment().format("YYYY-MM-DD"),
      choiceByUpdateDate: true
    }

    const options: RequestInit = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body)
    }

    try {
      const Response = await fetch(firstrequestUrl, options)
      const dataBlokers: any = await Response.json()
    } catch (error) {
      console.log(error)
    }
  },
}