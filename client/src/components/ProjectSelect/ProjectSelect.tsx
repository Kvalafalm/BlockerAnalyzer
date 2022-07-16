import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material"
import { shallowEqual, useDispatch, useSelector } from "react-redux"
import { appActions } from "../../store/app"
import { ISpace, Spacetype } from "../../store/app/interface"
import { RootState } from "../../store/reducers"

export const ProjectSelect = () => {
  const dispatch = useDispatch();
  const spaces = useSelector(
    (state: RootState): Array<ISpace> => state.appReducer?.spaces, shallowEqual
  )
  const currentSpace = useSelector(
    (state: RootState): Spacetype => state.appReducer?.currentSpace, shallowEqual
  )

  const handleChange = (event: SelectChangeEvent) => {
    let curSpace = spaces.find((element) => {
      return element.id === event.target.value
    })
    if (curSpace) {
      dispatch(appActions.setCurrentSpaceAndUpdateData(curSpace))
    }
  }

  const showSpaces = spaces && spaces.length > 0
  const currentSpaceId: string = currentSpace ? currentSpace.id : ''
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
        {showSpaces && spaces.map((element: ISpace) => {

          return <MenuItem value={element.id} key={element.id}>{element.name}</MenuItem>
        })}

      </Select>
    </FormControl>
  )
}
