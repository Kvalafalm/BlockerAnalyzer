import { Histogram } from "../../components"
import { useSelector } from "react-redux"
import { RootState } from "../../store/reducers"
import { useHistogramPageHooks } from "./HistogramPageHooks"
import { dataRow, iDataReducerState } from "../../store/data/interface"
import { useMemo } from "react"

export const HistogramPage = () => {
  const dataFiltred = useSelector(
    (state: RootState): Array<dataRow> => state.dataReducer.dataFiltred
  )

  const tags = useSelector(
    (state: RootState): Array<string> => state.dataReducer.tags
  )

  const { convertDataToHistogrammChartData } = useHistogramPageHooks()
  const dataForHC = convertDataToHistogrammChartData(dataFiltred)

  if (!dataFiltred && tags.length === 0) {
    return (
      <div>
        нет данных
      </div>
    )
  }
  return (
    <div>
      <Histogram
        data={dataForHC}
        seriesChart={tags} />
    </div>
  )
}
