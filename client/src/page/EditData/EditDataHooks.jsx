import { appActions } from "../../store/app"
import { useDispatch } from "react-redux"
import DeleteIcon from "@mui/icons-material/Delete"
import { IconButton, Tooltip } from "@mui/material"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"

export const useEditDataHook = () => {
  const dispatch = useDispatch()
  const handeOnClickDelete = id => {
    const newArray = dataJson.filter(element => element.id !== id)
    dispatch(appActions.clearDataJson())
    dispatch(appActions.updateDataJson(newArray))
  }

  const handeOnClickOpenComments = params => {
    window
      .open(
        `${params.linkIssue}?focusedCommentId=${params.idBloker}#comment-${params.idBloker}`,
        "_blank"
      )
      .focus()
  }

  const columns = [
    {
      field: "project",
      headerName: "Project",
      editable: true,
      width: 100,
      flex: 0.5,
    },
    {
      field: "idIssue",
      headerName: "Id issue",
      editable: true,
      hide: true,
      width: 100,
      flex: 0.5,
    },
    {
      field: "linkIssue",
      headerName: "Link",
      width: 100,
      flex: 0.5,
      editable: true,
    },
    {
      field: "idBloker",
      headerName: "Bloker id",
      hide: true,
      width: 100,
      flex: 0.5,
    },
    {
      field: "reason",
      headerName: "Reason",
      width: 450,
      editable: true,
      flex: 2.0,
    },
    {
      field: "decision",
      headerName: "Decision",
      width: 450,
      editable: true,
      hide: true,
      flex: 2.0,
    },
    {
      field: "typeIssue",
      headerName: "Type task",
      width: 450,
      editable: true,
      hide: true,
      flex: 2.0,
    },
    {
      field: "priority",
      headerName: "Priority",
      width: 20,
      editable: true,
      hide: true,
      flex: 2.0,
    },
    {
      field: "tags",
      headerName: `tags`,
      width: 200,
      editable: true,
      flex: 1.0,
    },
    {
      field: "start",
      headerName: `start`,
      width: 200,
      editable: true,
      type: "dateTime",
      flex: 1.0,
    },

    {
      field: "end",
      headerName: "end",
      type: "dateTime",
      width: 200,
      editable: true,
      flex: 1.0,
      description: "Date when bloker was deside",
    },
    {
      field: "time",
      headerName: "Days",
      type: "dateTime",
      width: 50,
      flex: 0.4,
      description: "Time from start to end blokering issue",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 150,
      renderCell: params => (
        <div>
          <Tooltip title="Open in new tab">
            <IconButton
              aria-label="delete"
              onClick={() => {
                handeOnClickOpenComments(params.row)
              }}
            >
              <OpenInNewIcon fontSize="small" color="primary" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton
              aria-label="delete"
              onClick={() => {
                handeOnClickDelete(params.id)
              }}
            >
              <DeleteIcon fontSize="small" color="primary" />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ]

  const editEnd = event => {
    const objIndex = dataJson.findIndex(obj => obj.id == event.id)
    if (event.field === "tags") {
      const newTagsArray = event.value.toString().split(",")
      dataJson[objIndex][event.field] = newTagsArray
    } else {
      dataJson[objIndex][event.field] = event.value
    }
    const newArray = dataJson.slice()
    dispatch(appActions.updateDataJson(newArray))
  }

  const handleClickSave = () => {}

  return {
    columns,
    handeOnClickOpenComments,
    editEnd,
    handleClickSave,
  }
}
