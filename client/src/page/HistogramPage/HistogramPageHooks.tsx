import { dataRow } from "../../store/app/interface"
interface IHistogramPageHook {
  convertDataToHistogrammChartData: Function;
}
type IHistogrammChartData = Array<IHistogrammChartDataRow> | undefined
interface IHistogrammChartDataRow {
  [key: string]: string;
}

export const useHistogramPageHooks = (
  data: Array<dataRow>
): IHistogramPageHook => {
  const convertDataToHistogrammChartData = (
    data: Array<dataRow>
  ): IHistogrammChartData => {
    if (!data) {
      return undefined
    }
    let maxDays = 0
    const rows: Array<IHistogrammChartDataRow> = [
      {
        day: "0",
      },
    ]

    data.forEach(element => {
      let foundDay = false
      if (!element.time) {
        element.time = 0
      }
      rows.forEach(elementRows => {
        if (elementRows.day === element.time.toString()) {
          elementRows[element.tags[0]] = elementRows[element.tags[0]]
            ? (parseInt(elementRows[element.tags[0]]) + 1).toString()
            : "1"
          htmlData("html" + element.tags[0], element, elementRows)
          foundDay = true
        }
      })
      if (!foundDay) {
        const row: IHistogrammChartDataRow = {
          day: element.time.toString(),
        }
        if (maxDays < element.time) {
          maxDays = element.time
        }
        row[element.tags[0]] = "1"
        htmlData("html" + element.tags[0], element, row)
        rows.push(row)
      }
    })
    maxDays = maxDays * 1.1
    let i = 0
    while (i < maxDays) {
      i++
      let foundDay = false

      rows.forEach(elementRows => {
        if (elementRows.day === i.toString()) {
          foundDay = true
        }
      })

      if (!foundDay) {
        const row = {
          day: i.toString(),
        }
        rows.push(row)
      }
    }

    rows.sort((a, b) => {
      return parseInt(a.day) - parseInt(b.day)
    })
    return rows
  }

  const htmlData = (
    tag: string,
    data: dataRow,
    row: IHistogrammChartDataRow
  ) => {
    if (!row[tag]) {
      row[tag] = ""
    }
    let hintHTML: string = row[tag].toString()
    if (!tag) {
      hintHTML = ""
    }
    row[tag] += `
    <span>
      <a href="${data.linkIssue}?focusedCommentId=${data.idBloker}#comment-${
      data.idBloker
    }" target="_blank" >
        ${data.idIssue}
      </a>
      ${data.reason.substring(0, 50)} ...
    </span>
    <br>`
  }

  return {
    convertDataToHistogrammChartData,
  }
}
