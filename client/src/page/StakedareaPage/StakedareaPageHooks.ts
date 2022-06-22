import moment from "moment"
import { useMemo } from "react"
import { dataRow } from "../../store/app/interface"

export type groupByType = "day" | "mounth"

const formatExportDateDay = "YYYY-MM-DD"
const formatExportDateMounth = "MMM-YYYY"

interface StakedAreaDataRow {
  [key: string]: any;
}

type StakedAreaData = Array<StakedAreaDataRow> | undefined

interface StakedAreaHooks {
  dataChart: StakedAreaData;
}

export const useStakedAreaHook = (
  state: Array<dataRow>,
  groupBy: groupByType
): StakedAreaHooks => {
  const convertDataToStackedareaChartData = (
    data: Array<dataRow>
  ): StakedAreaData => {
    const rows: Array<StakedAreaDataRow> = []

    if (!Array.isArray(data)) {
      return undefined
    }
    let formatExportDate = formatExportDateMounth
    debugger
    if (groupBy === "day") {
      formatExportDate = formatExportDateDay
      alert("2222")
    }

    let MaxDate = data[0]?.start || moment()
    data.forEach(element => {
      let findRow = false
      const tag = element.tags[0]
      const tagConverted = getTagName(tag)
      rows.forEach(elementRow => {
        if (elementRow.date === element.start?.format(formatExportDate)) {
          if (!elementRow[tagConverted]) {
            elementRow[tagConverted] = 1
          } else {
            elementRow[tagConverted] = elementRow[tagConverted] + 1
          }

          addData("data" + tag, element, elementRow)
          htmlData("html" + tag, element, elementRow)
          findRow = true
        }
      })
      if (!findRow) {
        const dateAsDate = moment(element.start)
        const row: StakedAreaDataRow = {
          date: element.start?.format(formatExportDate),
          dateAsDate,
        }
        if (element.start?.isAfter(MaxDate)) {
          MaxDate = element.start
        }
        row[tagConverted] = 1

        htmlData("html" + tag, element, row)
        addData("data" + tag, element, row)
        rows.push(row)
      }
    })

    const MaxDatePlusOneMounth = moment(MaxDate).add(2, "M")
    rows.push({
      date: MaxDatePlusOneMounth.format(formatExportDate),
      dateAsDate: moment(MaxDatePlusOneMounth),
    })

    rows.sort((a, b) => {
      return a.dateAsDate - b.dateAsDate
    })
    return rows
  }

  const dataChart: StakedAreaData = useMemo(
    () => convertDataToStackedareaChartData(state),
    [state, groupBy]
  )

  return {
    dataChart,
  }
}

const htmlData = (tag: string, data: dataRow, row: StakedAreaDataRow) => {
  if (!row[tag]) {
    row[tag] = ""
  }

  const link = `${data.linkIssue}?focusedCommentId=${data.idBloker}#comment-${data.idBloker}`
  row[tag] += `
  <span>
    <a href="${link}" target="_blank" >${data.idIssue}</a>
        ${data?.reason?.substring(0, 50)} ...
    </span>
  <br>`
}

const getTagName = (tag: string): string => {
  return "tag_" + tag
}

const addData = (name: string, data: dataRow, row: StakedAreaDataRow) => {
  if (!row["data" + name]) {
    row["data" + name] = []
  }
  row["data" + name].push(data)
}
