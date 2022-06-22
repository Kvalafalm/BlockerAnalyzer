import { useSelector } from "react-redux"
import { Bubblechart } from "../../components"
import { iAppReducerState } from "../../store/app/interface"
import { RootState } from "../../store/reducers"
import { useDataPrepare } from "./BublecharHooks"

export const BublecharPage = () => {
  const { data, tags } = useSelector(
    (state: RootState): iAppReducerState => state.appReducer
  )
  const { prepareData } = useDataPrepare()

  const { bubleData, maxCount, maxTime } = prepareData(data, tags)
  return (
    <div>
      <Bubblechart
        dataJSON={bubleData}
        middleCount={(maxCount + 1) / 2}
        middleTime={(maxTime + 1) / 2}
      />
    </div>
  )
}
