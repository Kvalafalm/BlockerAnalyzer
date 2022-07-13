import { useSelector } from "react-redux"
import { Bubblechart } from "../../components"
import { dataRow } from "../../store/data/interface"
import { RootState } from "../../store/reducers"
import { useDataPrepare } from "./BublecharHooks"

export const BublecharPage = () => {
  const dataFiltred = useSelector(
    (state: RootState): Array<dataRow> => state.dataReducer.dataFiltred
  )

  const tags = useSelector(
    (state: RootState): Array<string> => state.dataReducer.tags
  )

  const { prepareData } = useDataPrepare()

  const { bubleData, maxCount, maxTime } = prepareData(dataFiltred, tags)
  if (bubleData.length === 0) {
    return (
      <div>
        нет данных
      </div>
    )
  }

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
