import { StacketArea } from "../../components"
import { useSelector } from "react-redux"
import { Checkbox, FormControlLabel } from "@mui/material"
import { useState } from "react"
import { groupByType, useStakedAreaHook } from "./StakedareaPageHooks"
import { RootState } from "../../store/reducers"
import { iDataReducerState } from "../../store/data/interface"

export const StakedareaPage = () => {
  const { dataFiltred, tags } = useSelector(
    (state: RootState): iDataReducerState => state.dataReducer
  )
  const [stackedChart, setStackedChart] = useState(true)
  const groupByTypeFirstRender: groupByType = "mounth"
  const [groupByData, setGroupByData] = useState<groupByType>(groupByTypeFirstRender)
  const { dataChart } = useStakedAreaHook(dataFiltred, groupByData)

  if (dataFiltred.length === 0) {
    return <div>No data</div>
  }

  const handleChangeCheckbox = (event: any) => {
    setStackedChart(event.target.checked)
  }
  const handleChangeCheckboxGroupBY = (event: any) => {
    if (event.target.checked) {
      const groupByValue: groupByType = "mounth"
      setGroupByData(groupByValue)
    } else {
      const groupByValue: groupByType = "day"
      setGroupByData(groupByValue)
    }
  }
  return (
    <div>
      <StacketArea
        data={dataChart}
        seriesChart={tags}
        stackedChart={stackedChart}
        period={groupByData}
      />

      <FormControlLabel
        control={<Checkbox defaultChecked onChange={handleChangeCheckbox} />}
        label="Stacked"
      />
      <FormControlLabel
        control={
          <Checkbox defaultChecked onChange={handleChangeCheckboxGroupBY} />
        }
        label="Group by mounth"
      />
    </div>
  )
}
