import Modal from "@mui/material/Modal"
import {
  Button,
  Divider,
  FormControl,
  Input,
  InputLabel,
  Stack,
  Typography,
} from "@mui/material"
import { useLayoutEffect, useState } from "react"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import { ProjectAdd } from "../ProjectAdd"
import { appActions } from "../../store/app"
import { useDispatch, useSelector } from "react-redux"
import { DesktopDatePicker, LocalizationProvider } from "@mui/lab"
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment, { Moment } from "moment"
import { authData, iNotification, IUpdateRequest } from "../../store/app/interface"
import { RootState } from "../../store/reducers"
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",

  boxShadow: 24,
  p: 4,
}


type emptyRequest = {
  StartDate: Moment | null,
  EndDate: Moment | null,
  choiceByUpdateDate: boolean,
}

export const Settings = (props: any) => {
  const dispatch = useDispatch();

  const connectionData = useSelector(
    (state: RootState): authData => state.appReducer.accountData
  )

  useLayoutEffect(() => {
    dispatch(appActions.downloadAccountParametrs('id'))
  }, [])

  const change = (event: any) => {
    const data: authData = { ...connectionData }
    const id: string = event.target.id
    // @ts-ignore
    data[id] = event.target.value
    dispatch(appActions.setAccountData(data))

  }

  const [requestSettings, SetRequestSettings] = useState<emptyRequest>({
    StartDate: null,
    EndDate: null,
    choiceByUpdateDate: true,
  })

  const handleChangeStartDate = (data: Moment | null) => {
    SetRequestSettings({ ...requestSettings, StartDate: data })
  }

  const handleChangeEndDate = (data: Moment | null) => {
    const now = moment()
    if (data?.isAfter(now)) {
      data = now
    }
    SetRequestSettings({ ...requestSettings, EndDate: data })
  }

  const testConnection = () => {
    dispatch(appActions.testConnectionSettings(connectionData))
    const notification: iNotification = { message: "Connections ...", type: "info" }
    dispatch(appActions.addNotification(notification))
  }

  const saveAuthData = () => {
    if (connectionData.login === '' || connectionData.password === '' || connectionData.externalServiceURL === '') {
      const notification: iNotification = { message: "write creditals", type: "warning" }
      dispatch(appActions.addNotification(notification))
      return
    }
    const id: string = connectionData.id ? connectionData.id :"newconnections"
    dispatch(appActions.saveAuthData(connectionData, id))
  }

  const paramsRequest: IUpdateRequest = {
    idboard: '',
    StartDate: requestSettings.StartDate || requestSettings.StartDate === '' ? requestSettings.StartDate?.format("YYYY-MM-DD") : '1990-01-01',
    EndDate: requestSettings.EndDate || requestSettings.EndDate === '' ? requestSettings.EndDate?.format("YYYY-MM-DD") : moment().format("YYYY-MM-DD"),
    choiceByUpdateDate: requestSettings.choiceByUpdateDate,
  }

  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="SettignsModal-title"
      aria-describedby="SettignsModal-description"
    >
      <Box sx={style}>
        <Stack spacing={3}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Setting
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            JiraConnector
          </Typography>
          <FormControl>
            <TextField
              id="externalServiceURL"
              label="URL"
              variant="outlined"
              value={connectionData.externalServiceURL}
              fullWidth
              onChange={change}
            />
            <TextField
              id="login"
              label="login"
              variant="outlined"
              fullWidth
              value={connectionData.login}
              onChange={change}
            />
            <TextField
              id="password"
              label="password"
              variant="outlined"
              fullWidth
              onChange={change}
              value={connectionData.password}
              defaultValue={connectionData.password}
            />
            <Input type="password" ></Input>
          </FormControl>

          <FormControl sx={{ display: 'inline', m: 3, minWidth: 500 }}>
            <Button onClick={testConnection}>Test Connection</Button>
          </FormControl>
          <Divider />
          <Typography id="modal-modal-description" sx={{ mt: 2 }} variant="h6" component="h2">
            Add board or update data board
          </Typography>
          <ProjectAdd paramsRequest={paramsRequest} />
          <LocalizationProvider dateAdapter={AdapterMoment} sx={{ display: 'inline', m: 3, minWidth: 400 }}>
            <InputLabel>
              Import issue where last update
            </InputLabel >
            <DesktopDatePicker
              label="was more"
              inputFormat="DD/MM/YYYY"
              value={requestSettings.StartDate}
              onChange={handleChangeStartDate}
              renderInput={(params) => <TextField {...params} />}
            />
            <FormControl>
              <DesktopDatePicker
                label="was less"
                inputFormat="DD/MM/YYYY"
                value={requestSettings.EndDate}
                onChange={handleChangeEndDate}
                renderInput={(params) => <TextField {...params} />}
              />
            </FormControl>
          </LocalizationProvider>
          <Divider />
          <FormControl sx={{ display: 'inline', m: 3, minWidth: 500 }}>
            <Button onClick={saveAuthData}>Save</Button>
            <Button onClick={props.onClose}>Close</Button>
          </FormControl>

        </Stack>
      </Box>
    </Modal >
  )
}
