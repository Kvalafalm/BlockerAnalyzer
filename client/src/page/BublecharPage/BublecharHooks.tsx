import { dataRow } from "../../store/app/interface"

interface BubleDataRow {
  title: string;
  id: string;
  color: string;
  x: number;
  y: number;
  value: number;
}

interface iPrepareData {
  bubleData: Array<BubleDataRow>;
  maxCount: number;
  maxTime: number;
}

export const useDataPrepare = () => {
  let maxTime = 0
  let maxCount = 0

  const prepareData = (
    data: Array<dataRow>,
    tags: Array<string>
  ): iPrepareData => {
    const newData: Array<BubleDataRow> = []

    tags.forEach((elementTags: string) => {
      let count = 0
      let time = 0
      data.forEach((elementData: dataRow) => {
        if (elementData.tags.includes(elementTags)) {
          count = count + 1

          if (elementData.time) {
            time = time + elementData.time
          }
          if (maxTime < time) {
            maxTime = time
          }
          if (maxCount < count) {
            maxCount = count
          }
        }
      })

      newData.push({
        title: elementTags,
        id: elementTags,
        color: "#2b00ff",
        x: time,
        y: count,
        value: 2,
      })
    })

    return { bubleData: newData, maxCount, maxTime }
  }

  return {
    prepareData,
  }
}
