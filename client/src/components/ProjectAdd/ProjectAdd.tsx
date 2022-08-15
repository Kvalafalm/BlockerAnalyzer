import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Button, Box } from "@mui/material"
import { useEffect, useLayoutEffect, useState } from "react"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { ISpace, IUpdateRequest } from "../../store/app/interface"
import { dataActions } from "../../store/data"
import { RootState } from "../../store/reducers"
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';
import { appActions } from "../../store/app"

export const ProjectAdd = ({ paramsRequest }: { paramsRequest: IUpdateRequest }) => {
  const dispatch = useDispatch();
  const externalProjects = useSelector(
    (state: RootState): ISpace[] | undefined => state.dataReducer?.externalProjects, shallowEqual
  )

  const emptySpace: ISpace = {
    id: '',
    name: '',
    externalId: '',
    imported: false
  }
  const [externalSpace, setExternalSpace] = useState<ISpace>({
    ...emptySpace
  });

  useLayoutEffect(() => {
    if (!externalProjects) {
      dispatch(dataActions.downloadSpacesListAndCompare())
    }
  });

  useEffect(() => {
    if (!externalProjects) {
      return
    }
    const curSpace = externalProjects.find((element) => {
      return element.externalId == externalSpace.externalId
    })

    if (curSpace) {
      setExternalSpace(curSpace)
    }
  }, [externalSpace, externalProjects])

  const handleChange = (event: SelectChangeEvent) => {
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

  const handleAddSpace = () => {
    if (!externalSpace || externalSpace.externalId === '') {
      return
    }
    dispatch(appActions.importSpace(externalSpace, paramsRequest))
    dispatch(dataActions.downloadSpacesListAndCompare())
  }
  const handleRefresh = () => {
    if (!externalSpace) {
      return
    }
    if (paramsRequest.StartDate === null || paramsRequest.EndDate === null) {
      return
    }
    dispatch(appActions.updateImportBLockers({ ...paramsRequest, idboard: externalSpace.externalId }))

  }
  const handleDeleteSpace = () => {
    if (!externalSpace.id) {
      return
    }
    setExternalSpace({
      ...emptySpace
    })
    dispatch(appActions.deleteSpace(externalSpace.id))
    dispatch(dataActions.downloadSpacesListAndCompare())
  }

  const showBoards = externalProjects && externalProjects.length > 0
  return (
    <FormControl sx={{ display: 'inline', m: 3, minWidth: 500 }}>
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
          <Button onClick={handleRefresh}>
            refresh
          </Button>
          <Button onClick={handleDeleteSpace}>
            Delete
          </Button>
        </> :
        <Button onClick={handleAddSpace}>
          Add
        </Button>}
    </FormControl>
  )
}
