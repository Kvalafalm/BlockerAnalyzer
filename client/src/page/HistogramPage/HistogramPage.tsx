import { Histogram } from "../../components"
import { useSelector } from "react-redux"
import { iAppReducerState, RootState } from "../../store/app/interface"
import { useHistogramPageHooks } from "./HistogramPageHooks"
import { useMemo } from "react"

export const HistogramPage = () => {
  const { data, tags } = useSelector(
    (state: RootState): iAppReducerState => state.appReducer
  )
  const { convertDataToHistogrammChartData } = useHistogramPageHooks(data)
  const dataForHC = convertDataToHistogrammChartData(data)
/*   const dataForHC = useMemo(() => {
    convertDataToHistogrammChartData(data)
    console.log("convertDataToHistogrammChartData")
  }, [data]) */
  return (
    <div>
      <Histogram dataJSON={dataForHC} seriesChart={tags} />
    </div>
  )
}
