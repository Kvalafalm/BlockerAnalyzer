import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Button, Box } from "@mui/material"
import { useLayoutEffect, useState } from "react"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { ISpace } from "../../store/app/interface"
import { dataActions } from "../../store/data"
import { RootState } from "../../store/reducers"

export const ProjectAdd = () => {
  const dispatch = useDispatch();
  const externalProjects = useSelector(
    (state: RootState): ISpace[] | undefined => state.dataReducer?.externalProjects, shallowEqual
  )
  const [externalSpaceId, setExternalSpaceId] = useState('');

  useLayoutEffect(() => {
    if (!externalProjects) {
      dispatch(dataActions.downloadSpacesList())
    }
  });

  const handleChange = (event: SelectChangeEvent) => {
    setExternalSpaceId(event.target.value);
  }


  const showBoards = externalProjects && externalProjects.length > 0
  return (
    <FormControl sx={{ display: 'inline', m: 3, minWidth: 400 }}>
      <InputLabel id="spaceSelect-label">Space</InputLabel>
      <Select
        labelId="spaceSelect-label"
        id="spaceSelect"
        value={externalSpaceId}
        defaultValue=''
        label="Space"
        onChange={handleChange}
        sx={{ minWidth: 300 }}
      >
        {showBoards && externalProjects.map((element: ISpace) => {
          return <MenuItem value={element.externalId} key={element.externalId}>{element.name}</MenuItem>
        })}

      </Select>
      <Button>
        Add
      </Button>
    </FormControl>
  )
}
