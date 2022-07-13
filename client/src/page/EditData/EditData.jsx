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
import { iAppReducerState } from "../../store/app/interface"
import { RootState } from "../../store/reducers"

export const EditData = () => {
  const dataFiltred = useSelector(state => state.dataReducer.dataFiltred)

  const apiRef = useGridApiRef()
  const { columns, editEnd, handleClickSave } = useEditDataHook()

  return (
        <DataGrid
          apiRef={apiRef}
          rows={dataFiltred ? dataFiltred : []}
          columns={columns}
          autoHeight={true}
          components={{ Toolbar: CustomToolbar }}
          componentsProps={{
            toolbar: { save: { handleClickSave } },
          }}
          disableSelectionOnClick={true}
          onCellEditCommit={editEnd}
        />
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
