import { TextField } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { iAppReducerState } from "../../store/app/interface"
import { RootState } from "../../store/reducers"
import Box from "@mui/material/Box"
import FormLabel from "@mui/material/FormLabel"
import FormControl from "@mui/material/FormControl"
import FormGroup from "@mui/material/FormGroup"
import FormControlLabel from "@mui/material/FormControlLabel"
import FormHelperText from "@mui/material/FormHelperText"
import Checkbox from "@mui/material/Checkbox"
import { useEffect, useState } from "react"
import { TimeLine, TimeLineTable } from "../../components"
import { appActions } from "../../store/app"
import { Moment } from "moment"
const prepareTimeLineStatuses = (TimeLineStatuses: any, blokerData: any) => {
  return TimeLineStatuses
}

type TimeLineFilter = {
  subtasks: boolean,
  blockers: boolean,
  worklogs: boolean,
}

type rowBlocker = {
  description: string,
  start: Moment,
  end: Moment,
}

type blokerData = Array<rowBlocker>

export const TimeLinePage = () => {
  const dispatch = useDispatch()
  const { dataTimeline, TimeLineStatuses } = useSelector(
    (state: RootState): iAppReducerState => state.appReducer
  )

  const [data, setData] = useState(dataTimeline)

  useEffect(() => {
    setData(dataTimeline)
  }, [dataTimeline])

  const [rows, setRows] = useState({
    subtasks: false,
    blockers: true,
    worklogs: false,
  })

  const dateForTable = prepareTimeLineStatuses(TimeLineStatuses, rows)

  const [id, setId] = useState("BR-26099")

  const handleOnChangeIdInput = (event: any) => {
    setId(event.currentTarget.value)
  }

  const handlerOnChangeTimelineRows = (event: any) => {
    const newState = { ...rows }
    const name = event.target.name
    if (name === "subtasks") {
      newState.subtasks = event.target.checked
    }
    if (name === "blockers") {
      newState.blockers = event.target.checked
    }
    if (name === "worklogs") {
      newState.worklogs = event.target.checked
    }
    setRows({ ...newState })
  }

  useEffect(() => {
    dispatch(appActions.getInfoForTimeLine(id, rows))
  }, [id, rows])

  return (
    <div>
      TimeLine
      <TimeLine data={data} />
      <Box sx={{ display: "flex" }}>
        <TimeLineTable statuses={TimeLineStatuses} />
        <TextField
          label="Id"
          id="outlined-size-small"
          defaultValue={id}
          size="small"
          onChange={handleOnChangeIdInput}
        />

        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
          <FormLabel component="legend">Show</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={rows.subtasks}
                  onChange={handlerOnChangeTimelineRows}
                  name="subtasks"
                />
              }
              label="subtask"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={rows.blockers}
                  onChange={handlerOnChangeTimelineRows}
                  name="blockers"
                />
              }
              label="blockers"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={rows.worklogs}
                  onChange={handlerOnChangeTimelineRows}
                  name="worklogs"
                />
              }
              label="worklogs"
            />
          </FormGroup>
          <FormHelperText>chouse witch status show on timeline</FormHelperText>
        </FormControl>
      </Box>
    </div>
  )
}
