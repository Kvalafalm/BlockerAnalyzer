import { dataActions } from "../data";
import { appActionTypes, IUpdateRequest, ISpace, authData, iNotification } from "./interface"

export const appActions = {

  addNotification: (payload: iNotification) => ({ type: appActionTypes.ADD_NOTIFICATION, payload }),
  updateSpaces: (payload: Array<ISpace>) => ({ type: appActionTypes.SET_SPACES, payload }),
  setAccountData: (payload: authData) => ({ type: appActionTypes.SET_ACCOUNDDATA, payload }),
  setCurrentSpace: (payload: ISpace) => ({ type: appActionTypes.SET_CURRENTSPACE, payload }),
  clearAppNotifications: () => ({ type: appActionTypes.CLEAR_NOTIFICATIONS }),
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
      if (Response.status === 500) {
        const notification: iNotification = { message: Response.statusText, type: "error" }
        dispatch(appActions.addNotification(notification))
        return
      }

      const { result }: any = await Response.json()
      dispatch(appActions.updateSpaces(result))

    } catch (error: any) {
      if (error) {
        const message: string = error.toString();
        const notification: iNotification = { message, type: "error" }
        dispatch(appActions.addNotification(notification))
      }
    }
  },

  downloadStartingDataFromServer: () => async (dispatch: any) => {
    dispatch(appActions.downloadSpaces())
  },

  importSpace: (space: ISpace, params: IUpdateRequest) => async (dispatch: any) => {
    const requestUrl = `api/v1/space/`
    const headers = {
      "Content-Type": "application/json",
    }

    const options: RequestInit = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(space)
    }
    try {
      const Response = await fetch(requestUrl, options)

      if (Response.status === 500) {
        const notification: iNotification = { message: Response.statusText, type: "error" }
        dispatch(appActions.addNotification(notification))
        return
      }

      if (Response.status === 200) {
        await dispatch(appActions.downloadSpaces())
        await dispatch(appActions.updateImportBLockers({ ...params, idboard: space.externalId }))
      }

    } catch (error: any) {
      if (error) {
        const message: string = error.toString();
        const notification: iNotification = { message, type: "error" }
        dispatch(appActions.addNotification(notification))
      }
    }

  },

  deleteSpace: (id: string) => async (dispatch: any) => {
    const requestUrl = `api/v1/space/${id}`
    const headers = {
      "Content-Type": "application/json",
    }

    const options: RequestInit = {
      method: "DELETE",
      headers: headers,
    }

    try {
      const Response = await fetch(requestUrl, options)

      if (Response.status === 500) {
        const notification: iNotification = { message: Response.statusText, type: "error" }
        dispatch(appActions.addNotification(notification))
        return
      }

      if (Response.status === 200) {
        dispatch(appActions.downloadSpaces())
      }
    } catch (error: any) {
      if (error) {
        const message: string = error.toString();
        const notification: iNotification = { message, type: "error" }
        dispatch(appActions.addNotification(notification))
      }
    }

  },

  updateImportBLockers: (params: IUpdateRequest) => async (dispatch: any) => {
    if (!params) {
      return
    }

    const firstrequestUrl = `api/v1/ImportData/periodAsync`
    const headers = {
      "Content-Type": "application/json",
    }

    const body: IUpdateRequest = params

    const options: RequestInit = {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body)
    }

    try {
      const Response = await fetch(firstrequestUrl, options)
      if (Response.status === 500) {
        const notification: iNotification = { message: Response.statusText, type: "error" }
        dispatch(appActions.addNotification(notification))
        return
      }
      const dataBlokers: any = await Response.json()
    } catch (error: any) {
      if (error) {
        const message: string = error.toString();
        const notification: iNotification = { message, type: "error" }
        dispatch(appActions.addNotification(notification))
      }
    }
  },

  downloadAccountParametrs: (id: string) => async (dispatch: any) => {


    const firstrequestUrl = `api/v1/account/${id}`
    const headers = {
      "Content-Type": "application/json",
    }

    const options: RequestInit = {
      method: "GET",
      headers: headers,
    }

    try {
      const Response = await fetch(firstrequestUrl, options)
      if (Response.status === 500) {
        const notification: iNotification = { message: Response.statusText, type: "error" }
        dispatch(appActions.addNotification(notification))
        return
      }
      const data = await Response.json()
      const accountData: authData = await data.result
      dispatch(appActions.setAccountData(accountData))
    } catch (error: any) {
      if (error) {
        const message: string = error.toString();
        const notification: iNotification = { message, type: "error" }
        dispatch(appActions.addNotification(notification))
      }
    }
  },

  testConnectionSettings: (connectionData: authData) => async (dispatch: any) => {

    const firstrequestUrl = `api/v1/account/testConnection`
    const headers = {
      "Content-Type": "application/json",
    }

    const options: RequestInit = {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        params: connectionData
      })
    }

    try {
      const response = await fetch(firstrequestUrl, options)
      if (response.status === 500) {
        const notification: iNotification = { message: response.statusText, type: "error" }
        dispatch(appActions.addNotification(notification))
        return
      }
      const result = await response.json()
      if (response.status === 200) {
        const notification: iNotification = { message: "Connection is establish", type: "success" }
        dispatch(appActions.addNotification(notification))
        return
      }

      if (response.status === 400) {
        const notification: iNotification = { message: result.message, type: "warning" }
        dispatch(appActions.addNotification(notification))
        return
      }
    } catch (error: any) {
      if (error) {
        const message: string = error.toString();
        const notification: iNotification = { message, type: "error" }
        dispatch(appActions.addNotification(notification))
      }
    }
  },

  saveAuthData: (connectionData: authData, id: string) => async (dispatch: any) => {

    const firstrequestUrl = `api/v1/account/` + id
    const headers = {
      "Content-Type": "application/json",
    }

    const options: RequestInit = {
      method: "PUT",
      headers: headers,
      body: JSON.stringify({
        params: connectionData
      })
    }

    try {
      const response = await fetch(firstrequestUrl, options)
      if (response.status === 500) {
        const notification: iNotification = { message: response.statusText, type: "error" }
        dispatch(appActions.addNotification(notification))
        return
      }
      if (response.status === 200) {
        const notification: iNotification = { message: "Data saved successfully ", type: "success" }
        dispatch(appActions.addNotification(notification))
        return
      }

      if (response.status === 400) {
        const notification: iNotification = { message: "Something went wrong", type: "warning" }
        dispatch(appActions.addNotification(notification))
        return
      }
    } catch (error: any) {
      if (error) {
        const message: string = error.toString();
        const notification: iNotification = { message, type: "error" }
        dispatch(appActions.addNotification(notification))
      }
    }
  },
}