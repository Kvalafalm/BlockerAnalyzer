import * as am4core from "@amcharts/amcharts4/core"
import * as am4charts from "@amcharts/amcharts4/charts"
import am4themes_animated from "@amcharts/amcharts4/themes/animated"
import { useEffect, useState } from "react"

am4core.useTheme(am4themes_animated)

const initializeChart = (divName, period) => {
  let chart = am4core.create(divName, am4charts.XYChart)
  //chart.dateFormatter.inputDateFormat = "MMM-yyyy";

  let dateAxis = chart.xAxes.push(new am4charts.DateAxis())
  dateAxis.renderer.minGridDistance = 60
  dateAxis.startLocation = 0.5
  dateAxis.endLocation = 0.5
  dateAxis.skipEmptyPeriods = false
  /*   dateAxis.dateFormats.setKey("month", "MMM-yy")
  dateAxis.baseInterval = [
    { timeUnit: "month", count: 1 },
    { timeUnit: "year", count: 1 },
  ] */
  if ((period = "day")) {
    chart.dateFormatter.inputDateFormat = "yyyy-MM-dd"
  } else if ((period = "month")) {
    chart.dateFormatter.inputDateFormat = "MMM-yyyy"
  }
  let valueAxis = chart.yAxes.push(new am4charts.ValueAxis())
  valueAxis.tooltip.disabled = true

  chart.series.createSerials = (name, field, dateX) => {
    let series = chart.series.push(new am4charts.LineSeries())
    series.name = "#" + name
    series.dataFields.dateX = dateX
    series.dataFields.valueY = field
    series.dataFields.categoryX = "html" + name

    series.tooltipHTML = `
        <span style='font-size:14px; color:#000000;'>
            ${name}: <b> {valueY.value} </b>
        
        <br>
        {categoryX}
        </span>
        `
    series.tooltip.label.interactionsEnabled = true
    series.tooltip.keepTargetHover = true
    series.tooltip.background.fill = am4core.color("#FFF")
    series.tooltip.getFillFromObject = false
    series.tooltip.getStrokeFromObject = true
    series.tooltip.background.strokeWidth = 3
    series.tooltip.pointerOrientation = "vertical"
    series.sequencedInterpolation = true
    series.fillOpacity = 0
    series.defaultState.transitionDuration = 10
    series.stacked = false
    series.strokeWidth = 2

    let bullet = series.bullets.push(new am4charts.Bullet())
    let square = bullet.createChild(am4core.Circle)
    square.width = 15
    square.height = 15
    square.horizontalCenter = "middle"
    square.verticalCenter = "middle"
  }

  chart.cursor = new am4charts.XYCursor()
  /* chart.cursor.xAxis = dateAxis; */
  chart.scrollbarX = new am4core.Scrollbar()

  // Add a legend
  chart.legend = new am4charts.Legend()
  chart.legend.position = "top"

  // axis ranges
  return chart
}

export const StacketArea = ({ seriesChart, data, stackedChart, period }) => {
  const divName = "chartdiv"

  const [state, setState] = useState({ chart: null, initialize: false })
  useEffect(() => {
    if (!state.initialize) {
      setState({
        ...state,
        createSerials: true,
        initialize: true,
        chart: initializeChart(divName, period),
      })
    }
  }, [setState, state])

  useEffect(() => {
    if (state.createSerials) {
      while (state.chart.series.length > 0) {
        state.chart.series.removeIndex(0).dispose()
      }

      seriesChart?.forEach(element => {
        state.chart.series.createSerials(element, "tag_" + element, "date")
      })
      setState({
        ...state,
        createSerials: false,
      })
    }
  }, [seriesChart, state.createSerials, state, period])

  useEffect(() => {
    state?.chart?.series?.values.forEach(element => {
      element.stacked = !!stackedChart
    })
  }, [stackedChart, state.createSerials, state?.chart?.series?.values])

  if (state?.chart) {
    state.chart.data = data
  }

  return <div id="chartdiv" style={{ width: "100%", height: "800px" }}></div>
}
