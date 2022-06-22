import React from "react"
import { useSelector } from "react-redux"

import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
  useGridApiRef,
} from "@mui/x-data-grid"
import SaveIcon from "@mui/icons-material/Save"
import { IconButton } from "@mui/material"
import { useEditDataHook } from "./EditDataHooks"
import { iAppReducerState, RootState } from "../../store/app/interface"

export const EditData = () => {
  const { dataJson } = useSelector(state => state.appReducer)
  const dataEditGrid = dataJson

  const apiRef = useGridApiRef()
  const { columns, editEnd, handleClickSave } = useEditDataHook()

  return (
    <React.Fragment>
      {
        <DataGrid
          apiRef={apiRef}
          rows={dataEditGrid ? dataEditGrid : []}
          columns={columns}
          autoHeight={true}
          components={{ Toolbar: CustomToolbar }}
          componentsProps={{
            toolbar: { save: { handleClickSave } },
          }}
          disableSelectionOnClick={true}
          onCellEditCommit={editEnd}
        />
      }
    </React.Fragment>
  )
}

const CustomToolbar = props => {
  return (
    <GridToolbarContainer>
      <IconButton aria-label="Save" onClick={props.save.handleClickSave}>
        <SaveIcon fontSize="medium" color="primary" />
      </IconButton>
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  )
}
