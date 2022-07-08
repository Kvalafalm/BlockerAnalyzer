import React, { useState } from "react"
import {
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Paper,
  Select,
} from "@mui/material"
import { DateRangePicker, LocalizationProvider } from "@mui/lab"
import DateAdapter from "@mui/lab/AdapterMoment"
import { useDispatch, useSelector } from "react-redux"
import { styled } from "@mui/material/styles"
import Stack from "@mui/material/Stack"
import { appActions } from "../../store/app"
import moment, { Moment } from "moment"
import { iAppReducerState } from "../../store/app/interface"
import { RootState } from "../../store/reducers"
import { RangeInput } from "@mui/lab/DateRangePicker/RangeTypes"
import { iDataReducerState } from "../../store/data/interface"

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
}))
export const FiltredBox = (props: any) => {
  const { tags, typesTask, projects, priorites, statuses } =
    useSelector((state: RootState): iAppReducerState => state.appReducer)

  const { filter } =
    useSelector((state: RootState): iDataReducerState => state.dataReducer)

  const valueStart: RangeInput<Moment> = [filter.start, filter.end]
  const [value, setValue] = useState(valueStart)

  const [statusesCheck, setStatusesCheck] = useState(filter.statuses)
  const [projectsCheck, setProjectsCheck] = useState(filter.projects)
  const [prioritesCheck, setPrioritesCheck] = useState(filter.priorites)
  const [tagsCheck, setTagsCheck] = useState(filter.tags)
  const [typesTaskChosen, setTypesTaskChosen] = useState(filter.typesTask)

  const dispatch = useDispatch()
  const handleChangeProjects = (event: any) => {
    const value = []
    const options = event.target
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value)
      }
    }
    setProjectsCheck(value)
  }
  const filtrData = () => {
    const filterData = {
      start: moment(value[0]),
      end: moment(value[1]),
      projects: projectsCheck ?? null,
      tags: tagsCheck ?? null,
      priorites: prioritesCheck ?? null,
      typesTask: typesTaskChosen ?? null,
      statuses: statusesCheck ?? null
    }

    dispatch(appActions.setFilter(filterData))
  }
  const clearFilter = () => {
    dispatch(appActions.clearFilter())
  }
  const handleChangeTags = (event: any) => {
    const value = []
    const options = event.target
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value)
      }
    }
    setTagsCheck(value)
  }

  const handleChangePriorites = (event: any) => {
    const value = []
    const options = event.target
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value)
      }
    }
    setPrioritesCheck(value)
  }

  const handleChangeStatus = (event: any) => {
    const value = []
    const options = event.target
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value)
      }
    }
    setStatusesCheck(value)
  }

  const handleChangeTypesTask = (event: any) => {
    const value = []
    const options = event.target
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value)
      }
    }
    setTypesTaskChosen(value)
  }

  const style: React.CSSProperties = {
    display: props.show ? "block" : "none",
    top: 65,
    position: "absolute",
    right: 0,
  }
  return (
    <div id={"id11"} style={style}>
      <Paper>
        <Box
          sx={{
            width: 300,
            height: "100vh",
          }}
          m={2}
          pt={3}
        >
          Filters
          <Stack spacing={2}>
            <Item>
              <LocalizationProvider dateAdapter={DateAdapter}>
                <DateRangePicker
                  startText="From"
                  endText="To"
                  value={value}
                  onChange={newValue => {
                    setValue(newValue)
                  }}
                  renderInput={(startProps, endProps) => (
                    <React.Fragment>
                      <TextField {...startProps} />
                      <Box sx={{ mx: 2 }}> to </Box>
                      <TextField {...endProps} />
                    </React.Fragment>
                  )}
                />
              </LocalizationProvider>
            </Item>
            {projects.length > 0 ? (
              <Item>
                <FormControl fullWidth>
                  <InputLabel shrink id="projectSelectLabel">
                    Projects
                  </InputLabel>
                  <Select
                    labelId="projectSelectLabel"
                    id="projectSelectLabel"
                    multiple
                    native
                    value={projectsCheck}
                    label="Projects"
                    onChange={handleChangeProjects}
                    inputProps={{
                      id: "projectSelectLabel-multiple-native",
                    }}
                  >
                    {projects.map(name => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </Item>
            ) : (
              ""
            )}
            {Array.isArray(tags) && tags.length > 0 ? (
              <Item>
                <FormControl fullWidth>
                  <InputLabel shrink id="tagsSelectLabel">
                    Tags
                  </InputLabel>
                  <Select
                    labelId="tagsSelectLabel"
                    id="tagsSelectLabel"
                    multiple
                    native
                    value={tagsCheck}
                    label="Tags"
                    onChange={handleChangeTags}
                    inputProps={{
                      id: "tagsSelectLabel-multiple-native",
                    }}
                  >
                    {tags.map(name => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </Item>
            ) : (
              ""
            )}
            {Array.isArray(typesTask) && typesTask.length > 0 ? (
              <Item>
                <FormControl fullWidth>
                  <InputLabel shrink id="typesSelectLabel">
                    Types task
                  </InputLabel>
                  <Select
                    labelId="typesSelectLabel"
                    id="typesSelectLabel"
                    multiple
                    native
                    value={typesTaskChosen}
                    label="Types task"
                    onChange={handleChangeTypesTask}
                    inputProps={{
                      id: "typesSelectLabel-multiple-native",
                    }}
                  >
                    {typesTask.map(name => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </Item>
            ) : (
              "no types"
            )}

            {Array.isArray(priorites) && priorites.length > 0 ? (
              <Item>
                <FormControl fullWidth>
                  <InputLabel shrink id="Priorites">
                    Priorites
                  </InputLabel>
                  <Select
                    labelId="Priorites"
                    id="Priorites"
                    multiple
                    native
                    value={prioritesCheck}
                    label="Priorites"
                    onChange={handleChangePriorites}
                    inputProps={{
                      id: "Priorites-multiple-native",
                    }}
                  >
                    {priorites.map(name => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </Item>
            ) : (
              "no priorites"
            )}

            {Array.isArray(statuses) && statuses.length > 0 ? (
              <Item>
                <FormControl fullWidth>
                  <InputLabel shrink id="Statuses">
                    Status
                  </InputLabel>
                  <Select
                    labelId="Statuses"
                    id="Statuses"
                    multiple
                    native
                    value={statusesCheck}
                    label="Statuses"
                    onChange={handleChangeStatus}
                    inputProps={{
                      id: "Statuses-multiple-native",
                    }}
                  >
                    {statuses.map(name => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </Item>
            ) : (
              "no statuses"
            )}

            <Item>
              <Button onClick={filtrData}>Apply</Button>
              <Button onClick={clearFilter}>Clear</Button>
            </Item>
          </Stack>
        </Box>
      </Paper>
    </div>
  )
}
