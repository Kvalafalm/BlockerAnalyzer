import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { appActions } from "../../store/app"
import { Space } from "../../store/app/interface"
import { RootState } from "../../store/reducers"

export const ProjectSelect = () => {
  const dispatch = useDispatch();
  const spaces = useSelector(
    (state: RootState): Array<Space> => state.appReducer?.spaces, shallowEqual
  )
  const currentSpaceId = useSelector(
    (state: RootState): string => state.appReducer?.currentSpaceId, shallowEqual
  )

  const handleChange = (event: SelectChangeEvent) => {
    dispatch(appActions.setCurrentSpaceAndUpdateData(event.target.value));
  }

  const showSpaces = spaces && spaces.length > 0
  return (
    <FormControl sx={{ m: 1, minWidth: 300 }} size="small">
      <InputLabel id="spaceSelect-label">Space</InputLabel>
      <Select
        labelId="spaceSelect-label"
        id="spaceSelect"
        value={currentSpaceId}
        defaultValue=''
        label="Space"
        onChange={handleChange}
      >
        {showSpaces && spaces.map((element: Space) => {

          return <MenuItem value={element.id} key={element.id}>{element.name}</MenuItem>
        })}

      </Select>
    </FormControl>
  )
}
