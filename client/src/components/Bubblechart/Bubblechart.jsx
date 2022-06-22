import * as am4core from "@amcharts/amcharts4/core"
import * as am4charts from "@amcharts/amcharts4/charts"
import am4themes_animated from "@amcharts/amcharts4/themes/animated"
import { useEffect, useState } from "react"

am4core.useTheme(am4themes_animated)

const initializeChart = divName => {
  let chart = am4core.create(divName, am4charts.XYChart)

  let valueAxisX = chart.xAxes.push(new am4charts.ValueAxis())
  valueAxisX.renderer.ticks.template.disabled = true
  valueAxisX.renderer.axisFills.template.disabled = true

  let valueAxisY = chart.yAxes.push(new am4charts.ValueAxis())
  valueAxisY.renderer.ticks.template.disabled = true
  valueAxisY.renderer.axisFills.template.disabled = true

  let series = chart.series.push(new am4charts.LineSeries())
  series.dataFields.valueX = "x"
  series.dataFields.valueY = "y"
  series.dataFields.value = "value"
  series.strokeOpacity = 0
  series.sequencedInterpolation = true
  series.tooltip.pointerOrientation = "vertical"

  var series4 = chart.series.push(new am4charts.LineSeries())
  chart.seriesLL = series4
  series4.dataFields.valueX = "ax"
  series4.dataFields.valueY = "ay"
  series4.strokeOpacity = 1
  series4.fill = am4core.color("#1cb305")
  series4.ignoreMinMax = true
  series4.fillOpacity = 0.4
  var series3 = chart.series.push(new am4charts.LineSeries())
  chart.seriesHL = series3
  series3.dataFields.valueX = "ax"
  series3.dataFields.valueY = "ay"
  series3.strokeOpacity = 1
  series3.fill = am4core.color("#bdba00")
  series3.ignoreMinMax = true
  series3.fillOpacity = 0.4
  var series2 = chart.series.push(new am4charts.LineSeries())
  chart.seriesLH = series2
  series2.dataFields.valueX = "ax"
  series2.dataFields.valueY = "ay"
  series2.strokeOpacity = 1
  series2.fill = am4core.color("#bdba00")
  series2.ignoreMinMax = true
  series2.fillOpacity = 0.4
  var series1 = chart.series.push(new am4charts.LineSeries())
  chart.seriesHH = series1
  series1.dataFields.valueX = "ax"
  series1.dataFields.valueY = "ay"
  series1.strokeOpacity = 1
  series1.fill = am4core.color("#ff0000")
  series1.ignoreMinMax = true
  series1.fillOpacity = 0.4
  let bullet = series.bullets.push(new am4core.Circle())
  bullet.fill = am4core.color("#ff0000")
  bullet.propertyFields.fill = "color"
  bullet.strokeOpacity = 0
  bullet.strokeWidth = 2
  bullet.fillOpacity = 0.5
  bullet.stroke = am4core.color("#ffffff")
  bullet.hiddenState.properties.opacity = 0
  bullet.tooltipText =
    "[bold]#{title}:[/]\n Time in block : {valueX.value} days \n Frequency:{valueY.value} pieces "

  let outline = chart.plotContainer.createChild(am4core.Circle)
  outline.fillOpacity = 0
  outline.strokeOpacity = 0.8
  outline.stroke = am4core.color("#ff0000")
  outline.strokeWidth = 2
  outline.hide(0)

  let blurFilter = new am4core.BlurFilter()
  outline.filters.push(blurFilter)

  bullet.events.on("over", function (event) {
    let target = event.target
    outline.radius = target.pixelRadius + 2
    outline.x = target.pixelX
    outline.y = target.pixelY
    outline.show()
  })

  bullet.events.on("out", function (event) {
    outline.hide()
  })

  let hoverState = bullet.states.create("hover")
  hoverState.properties.fillOpacity = 1
  hoverState.properties.strokeOpacity = 1

  series.heatRules.push({
    target: bullet,
    min: 2,
    max: 60,
    property: "radius",
  })

  bullet.adapter.add("tooltipY", function (tooltipY, target) {
    return -target.radius
  })

  chart.cursor = new am4charts.XYCursor()
  chart.cursor.behavior = "zoomXY"
  chart.cursor.snapToSeries = series

  chart.scrollbarX = new am4core.Scrollbar()
  chart.scrollbarY = new am4core.Scrollbar()

  return chart
}

export const Bubblechart = props => {
  const divName = "chartdiv"

  const generateData = (y, x, time, offen) => {
    const data = [
      {
        ax: x,
        ay: y,
      },
      {
        ax: x + offen,
        ay: y,
      },
      {
        ax: x + offen,
        ay: y + time,
      },
      {
        ax: x,
        ay: y + time,
      },
    ]
    return data
  }
  const [state, setState] = useState({ chart: null, initialize: false })
  useEffect(() => {
    if (!state.initialize) {
      setState({
        ...state,
        createSerials: true,
        initialize: true,
        chart: initializeChart(divName),
      })
    }
  }, [setState, state])
  if (state.chart) {
    state.chart.seriesHL.data = generateData(
      props.middleCount,
      0,
      props.middleCount,
      props.middleTime
    )
    state.chart.seriesLH.data = generateData(
      0,
      props.middleTime,
      props.middleCount,
      props.middleTime
    )
    state.chart.seriesLL.data = generateData(
      0,
      0,
      props.middleCount,
      props.middleTime
    )
    state.chart.seriesHH.data = generateData(
      props.middleCount,
      props.middleTime,
      props.middleCount,
      props.middleTime
    )
  }
  if (state?.chart) {
    state.chart.data = props.dataJSON
  }

  return <div id="chartdiv" style={{ width: "100%", height: "800px" }}></div>
}
