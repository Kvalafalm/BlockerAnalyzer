import { Alert, Button, CircularProgress } from "@mui/material"
import { json2xml, xml2json } from "xml-js"
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { useState } from "react"
import { appActions } from "../../store/app"
import UploadIcon from "@mui/icons-material/Upload"
import ClearIcon from "@mui/icons-material/Clear"
import DownloadIcon from "@mui/icons-material/Download"
import CodeIcon from "@mui/icons-material/Code"
import moment from "moment"
/* const row = {
  idIssue: "",
  linkIssue: "",
  idBloker: "",
  start: "",
  end: "",
  time: "",
  tags: []
} */

export const Import = () => {
  const dispatch = useDispatch()
  const { errors, dataJson } = useSelector(state => state.appReducer)
  const [parsing, setParsing] = useState(false)
  const parseXML = () => {
    const file = document.getElementById("raised-button-file").files[0]
    var reader = new FileReader()
    setParsing(true)
    reader.readAsText(file)
    reader.onload = function () {
      dispatch(appActions.clearErrors())
      var stringData = reader.result

      const resultForParcing = stringData
        .replaceAll("<b>", "[b]")
        .replaceAll("</b>", "[/b]")
        .replaceAll("<p>", "[p]")
        .replaceAll("</p>", "[/p]")
        .replaceAll("&", "&amp;")
      let startItemPos = 0
      let endItemPos = 0
      let trimmedData = resultForParcing
      let result = []
      let allIssues = 0
      let goodIssues = 0
      while (trimmedData.indexOf("<item>") > 1) {
        allIssues = allIssues + 1
        let item = undefined
        startItemPos = trimmedData.indexOf("<item>")
        endItemPos = trimmedData.indexOf("</item>")
        const stringItem = trimmedData.slice(startItemPos, endItemPos + 7)
        try {
          let json = ""

          try {
            json = xml2json(stringItem, { compact: true, spaces: 4 })
          } catch {}
          item = JSON.parse(json)
          goodIssues = goodIssues + 1
        } catch (e) {
          //<key id="135003">SA-7431</key>
          const startKeyPos = stringItem.indexOf("<key id=")
          const startPos = stringItem
            .slice(stringItem.indexOf("<key id="))
            .indexOf(">")
          const endPos = stringItem.indexOf("</key>")
          const issueId = stringItem.slice(startPos + startKeyPos + 1, endPos)
          dispatch(
            appActions.pushError({ key: issueId, message: e, type: "error" })
          )
        } finally {
          trimmedData = trimmedData.substring(endItemPos + 7)
          if (item) {
            result.push(item.item)
          }
        }
      }
      dispatch(
        appActions.pushError({
          message: ` Processed ${goodIssues} issues from ${allIssues}`,
          type: "success",
        })
      )

      parseJiraData(result)
      setParsing(false)
    }
  }
  const parseJiraData = data => {
    const rowsData = []
    let countOFBlokers = 0
    data.forEach(element => {
      const issue = {
        project: element.project._text,
        idIssue: element.key._text,
        priority: element.priority._attributes.id - 1,
        titleIssue: element.title._text,
        linkIssue: element.link._text,
        typeIssue: element.type._text,
      }

      const newRows = commentsProcess(element.comments.comment, issue)
      newRows.forEach(element => {
        element.id = countOFBlokers++
        rowsData.push(element)
      })
    })

    dispatch(appActions.updateDataJson(rowsData))
  }

  const clearDataJson = () => {
    dispatch(appActions.clearDataJson())
    dispatch(appActions.clearErrors())
  }

  const commentsProcess = (data, issue) => {
    const rows = []
    let expectedStartBloker = true
    let row = {
      ...issue,
      idBloker: "",
      start: "",
      end: "",
      time: "",
      decision: "",
      tags: [],
    }
    let ArrayData = data
    if (!Array.isArray(ArrayData)) {
      ArrayData = []
      ArrayData.push(data)
    }

    let countIssueBlokers = 0

    const haveStringStartBlokerComment = String => {
      if (
        String.indexOf("/images/icons/emoticons/flag.png") >= 0 ||
        String.indexOf("Добавлен флаг:") >= 0 ||
        String.indexOf("Flag added") >= 0
      ) {
        return true
      }
      return false
    }
    const cutTheText = (text, tags) => {
      let newText = text
        .replaceAll("/images/icons/emoticons/flag.png'", "")
        .replaceAll("Флажок добавлен", "")
        .replaceAll("Добавлен флаг ", "")
        .replaceAll("Flag added ", "")

      tags &&
        tags.forEach(element => {
          newText = newText.replaceAll("#" + element, "")
        })

      return newText
    }
    const haveStringEndBlokerComment = String => {
      if (String.indexOf("/images/icons/emoticons/flag_grey.png") >= 0) {
        return true
      }
      return false
    }
    let SaveFinalBloker = true
    ArrayData.forEach(coment => {
      const newString = json2xml(coment, {
        compact: true,
        ignoreComment: true,
        spaces: 4,
      })
      const text = newString
        .replaceAll("[b]", "<b>")
        .replaceAll("[/b]", "</b>")
        .replaceAll("[p]", "<p>")
        .replaceAll("[/p]", "</p>")
        .replace(/<\/?[^>]+(>|$)/g, "")

      if (
        haveStringEndBlokerComment(newString) &&
        haveStringStartBlokerComment(newString)
      ) {
        // Флаг добавлен и серый и красный
        dispatch(
          appActions.pushError({
            message: ` issue ${issue.idIssue} have two flags red and grey. I don\`t know what i must do.`,
            type: "warning",
          })
        )
      } else if (haveStringEndBlokerComment(newString)) {
        // ФлагСерый Сняли блокировку добавлен
        if (!expectedStartBloker) {
          let endDate = new Date(coment._attributes.created)
          if (text.indexOf(EDTag) > 0) {
            endDate = new Date(
              text.substring(
                text.indexOf(EDTag) + EDTag.length,
                text.indexOf(EDTag) + 10 + EDTag.length
              )
            )
          }
          if (row.end == undefined) {
            row.end = moment(endDate)
          }
          row.decision = text
          expectedStartBloker = true
          rows.push(row)
          SaveFinalBloker = false
        }
      } else if (haveStringStartBlokerComment(newString)) {
        let startDate = new Date(coment._attributes.created)
        let endDate = undefined
        if (text.indexOf(EDTag) > 0) {
          endDate = new Date(
            text.substring(
              text.indexOf(EDTag) + EDTag.length,
              text.indexOf(EDTag) + 10 + EDTag.length
            )
          )
        }
        if (text.indexOf(SDTag) > 0) {
          startDate = new Date(
            text.substring(
              text.indexOf(SDTag) + SDTag.length,
              text.indexOf(SDTag) + 10 + SDTag.length
            )
          )
        }
        // ФлагКрасный Поставили блокировку добавлен
        if (expectedStartBloker) {
          row = {
            ...issue,
            idBloker: coment._attributes.id,
            start: startDate ? moment(startDate) : null,
            end: endDate ? moment(endDate) : null,
            reason: cutTheText(text, extractTagsFromText(text)),
            tags: extractTagsFromText(text),
          }
          expectedStartBloker = false
          SaveFinalBloker = true
          countIssueBlokers++
        } else {
          rows.push(row)
          row = {
            ...issue,
            idBloker: coment._attributes.id,
            start: startDate ? moment(startDate) : null,
            end: endDate ? moment(endDate) : null,
            reason: cutTheText(text, extractTagsFromText(text)),
            tags: extractTagsFromText(text),
          }
          countIssueBlokers++
          SaveFinalBloker = true
        }
      }
    })
    if (SaveFinalBloker) {
      rows.push(row)
    }
    if (countIssueBlokers === 0) {
      dispatch(
        appActions.pushError({
          message: ` issue ${issue.idIssue} doesn\`t have blokers`,
          type: "warning",
        })
      )
    } else {
      dispatch(
        appActions.pushError({
          message: ` issue ${issue.idIssue} have blokers ${countIssueBlokers}`,
          type: "info",
        })
      )
    }

    return rows
  }
  const extractTagsFromText = text => {
    const tags = []
    const search = " ".concat(text).split("#")
    if (text.indexOf("#") > 0) {
      let firstElement = true
      search.forEach(element => {
        if (firstElement) {
          firstElement = false
        } else {
          const searchPosEmpty =
            element.indexOf(" ") > 0 ? element.indexOf(" ") : 999999999
          const searchPosNew =
            element.indexOf("\n") > 0 ? element.indexOf("\n") : 999999999
          const searchPosMinus =
            element.indexOf("-") > 0 ? element.indexOf("-") : 999999999
          const searchPosEnd = element.length < 20 ? element.length : 20
          const min = Math.min(
            searchPosEmpty,
            searchPosNew,
            searchPosEnd,
            searchPosMinus
          )
          if (min) {
            tags.push(element.substring(0, min))
          }
        }
      })
    } else {
      tags.push("empty")
    }

    return tags
  }

  const exportToCSV = json3 => {
    if (!json3 || json3.length === 0) {
      return
    }
    var json = json3
    var fields = Object.keys(json[0])
    var replacer = function (key, value) {
      return value === null ? "" : value
    }
    var csv = json.map(function (row) {
      return fields
        .map(function (fieldName) {
          if ("string" === typeof row[fieldName]) {
            return JSON.stringify(
              row[fieldName].replaceAll(";", "%3b"),
              replacer
            )
          }
          return JSON.stringify(row[fieldName], replacer)
        })
        .join(";")
    })
    csv.unshift(fields.join(";")) // add header column
    csv = csv.join("\r\n")
    var dataStr = "data:text/csv;charset=UTF-8," + encodeURIComponent(csv)
    var dlAnchorElem = document.getElementById("downloadAnchorElem")
    dlAnchorElem.setAttribute("href", dataStr)
    dlAnchorElem.setAttribute("download", "parse.csv")
    dlAnchorElem.click()
  }
  const [importing, setImporting] = useState(false)

  const importCSV = () => {
    const file = document.getElementById("inputCSV-button-file").files[0]
    var reader = new FileReader()
    reader.readAsText(file)
    setImporting(true)
    reader.onload = (function (file) {
      return function () {
        const lines = this.result.split("\n")
        const result = []
        const headers = lines[0].replaceAll(`\r`, "").split(";")

        for (let i = 1; i < lines.length; i++) {
          const obj = {}
          obj.id = i
          const currentline = lines[i].split(";")

          for (var j = 0; j < headers.length; j++) {
            let value = currentline[j] ?? ""
            value = value
              .replaceAll(`\\n`, "")
              .replaceAll(`\n`, "")
              .replaceAll(`\" `, "")
              .replaceAll(`\"`, "")
              .replaceAll(`\r`, "")

            if (headers[j] === "tags") {
              const newTags = []
              value
                .replaceAll(`[`, "")
                .replaceAll(`]`, "")
                .split(",")
                .forEach(element => {
                  newTags.push(element)
                })

              obj[headers[j]] = newTags
            } else if (
              headers[j] === "start" ||
              headers[j] === "end"
            ) {
              if (!!value) {
                obj[headers[j]] = new Date(value)
              }
            } else {
              obj[headers[j]] = value
            }
          }

          result.push(obj)
        }
        dispatch(appActions.updateDataJson(result))
        setImporting(false)
      }
    })(file)
  }
  let alertKey = 0
  return (
    <React.Fragment>
      {/* 
            <TextField
                multiline
                fullWidth
                rows={10}
            /> */}
      <input
        accept="text/xml"
        style={{ display: "none" }}
        id="raised-button-file"
        multiple
        type="file"
        onChange={parseXML}
      />

      <label htmlFor="raised-button-file">
        <Button component="span">
          {parsing ? <CircularProgress /> : <CodeIcon />}
          Upload file and parse
        </Button>
      </label>

      {/*             <Button >
                <CodeIcon />parse XML and addData
            </Button> */}

      <Button onClick={clearDataJson}>
        <ClearIcon />
        Clear data
      </Button>

      <Button
        onClick={() => {
          exportToCSV(dataJson)
        }}
        disabled={dataJson.length === 0}
      >
        <DownloadIcon />
        export to csv
      </Button>

      <input
        accept="text/csv"
        style={{ display: "none" }}
        id="inputCSV-button-file"
        onChange={importCSV}
        type="file"
      />
      <label htmlFor="inputCSV-button-file">
        <Button component="span">
          {importing ? <CircularProgress /> : <UploadIcon />}
          import csv
        </Button>
      </label>

      <a id="downloadAnchorElem" style={{ display: "none" }}>
        1
      </a>

      {errors.map(element => {
        alertKey++
        return (
          <Alert severity={element.type} key={"alert" + alertKey}>
            {element.key && ` Issue id :${element.key}`}
            {element.message && ` Description:${element.message.toString()}`}
          </Alert>
        )
      })}

      {/* <div>{JSON.stringify(dataJson)}</div> */}
    </React.Fragment>
  )
}
