import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Button, Box } from "@mui/material"
import React, { useLayoutEffect, useState } from "react"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { ISpace } from "../../store/app/interface"
import { dataActions } from "../../store/data"
import { RootState } from "../../store/reducers"
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import { appActions } from "../../store/app"

export const ProjectAdd = () => {
  const dispatch = useDispatch();
  const externalProjects = useSelector(
    (state: RootState): ISpace[] | undefined => state.dataReducer?.externalProjects, shallowEqual
  )

  const importedProjects = useSelector(
    (state: RootState): ISpace[] | undefined => state.appReducer?.spaces, shallowEqual
  )

  const [externalSpace, setExternalSpace] = useState<ISpace>({
    id: '',
    name: '',
    externalId: '',
    imported: false
  });

  useLayoutEffect(() => {
    if (!externalProjects) {
      dispatch(dataActions.downloadSpacesListAndCompare(importedProjects))
    }
  });

/*   const handleUpdateData = () => {
    if (externalProjects && space.lastRequest) {
      const params = {
        idboard: externalProjects.externalId,
        StartDate: moment(space.lastRequest?.EndDate).format("YYYY-MM-DD") ?? '1990-00-00',
        EndDate: moment().format("YYYY-MM-DD"),
        choiceByUpdateDate: true
      }

      dispatch(appActions.updateImportBLockers(params))
    }
  } */
  const handleChange = (event: SelectChangeEvent) => {
    debugger
    if (!externalProjects) {
      return
    }
    const curSpace = externalProjects.find((element) => {
      return element.externalId == event.target.value.toString()
    })

    if (curSpace) {
      setExternalSpace(curSpace)
    }

  }


  const showBoards = externalProjects && externalProjects.length > 0
  return (
    <FormControl sx={{ display: 'inline', m: 3, minWidth: 400 }}>
      <InputLabel id="spaceSelect-label">Space</InputLabel>
      <Select
        labelId="spaceSelect-label"
        id="spaceSelect"
        value={externalSpace.externalId}
        defaultValue=''
        label="Select space"
        onChange={handleChange}
        sx={{ minWidth: 300 }}
      >
        {

          showBoards && externalProjects.map((element: ISpace) => {
            return <MenuItem value={element.externalId} key={element.externalId}>
              {element.imported && <CheckBoxOutlinedIcon />}
              {!element.imported && <CheckBoxOutlineBlankIcon />}
              {element.name}
            </MenuItem>
          })

        }

      </Select>

      {externalSpace.imported ?
        <>
          <Button>
            refresh
          </Button>
          <Button>
            Delete
          </Button>
        </> :
        <Button>
          Add
        </Button>}
    </FormControl>
  )
}
