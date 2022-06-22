import Modal from "@mui/material/Modal"
import {
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material"
import { useState } from "react"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"

export const Settings = props => {
  const [jiraDataAuth, setJiraDataAuth] = useState({
    url: "",
    login: "",
    tokenAPI: "",
    status: "",
  })
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",

    boxShadow: 24,
    p: 4,
  }
  const testConnection = async () => {
    const headers = []
    const response = await fetch("/rest/api/1/update", {
      method: "GET",
      headers: headers,
    })
    const data = await response.json()
    if (response.status === 200) {
      await setJiraDataAuth({ ...jiraDataAuth, status: " Successful ", data })
      await console.log(data)
    } else {
      setJiraDataAuth({ ...jiraDataAuth, status: " Error " })
    }
  }
  const change = event => {
    const data = { ...jiraDataAuth }
    data[event.target.id] = event.target.value
    setJiraDataAuth(data)
  }
  return (
    <Modal
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="SettignsModal-title"
      aria-describedby="SettignsModal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Setting
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          JiraConnector
        </Typography>
        <FormControl>
          <TextField
            id="login"
            label="login"
            variant="outlined"
            fullWidth
            onChange={change}
          />
          <TextField
            id="tokenAPI"
            label="tokenAPI"
            variant="outlined"
            fullWidth
            onChange={change}
          />
          <Input type="password" label="tokenAPI" variant="outlined"></Input>

          <TextField
            id="url"
            label="URL"
            variant="outlined"
            fullWidth
            onChange={change}
          />

          <FormLabel id="demo-row-radio-buttons-group-label">Gender</FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
          >
            <FormControlLabel
              value="byCreated"
              control={<Radio />}
              label="by Created"
            />
            <FormControlLabel
              value="byUpdate"
              control={<Radio />}
              label="by Update"
            />
          </RadioGroup>

          <Divider />
          <Button onClick={testConnection}>TestConnection</Button>
          <Button onClick={props.onClose}>Save</Button>
          <Button onClick={props.onClose}>Close</Button>
          {jiraDataAuth.status}
        </FormControl>
      </Box>
    </Modal>
  )
}
