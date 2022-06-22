import { useEffect, useState } from "react"
import * as am4core from "@amcharts/amcharts4/core"
import * as am4charts from "@amcharts/amcharts4/charts"
import * as am4plugins_timeline from "@amcharts/amcharts4/plugins/timeline"

const initializeChart = divName => {
  const chart = am4core.create(divName, am4plugins_timeline.SerpentineChart)
  chart.curveContainer.padding(50, 20, 50, 20);
  chart.levelCount = 4;
  chart.yAxisRadius = am4core.percent(25);
  chart.yAxisInnerRadius = am4core.percent(-25);
  chart.maskBullets = false;

  var colorSet = new am4core.ColorSet()
  colorSet.saturation = 0.5

  chart.dateFormatter.dateFormat = "yyyy-MM-dd hh:mm"
  chart.dateFormatter.inputDateFormat = "yyyy-MM-dd hh:mm"
  chart.fontSize = 11

  var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis())
  categoryAxis.dataFields.category = "category"
  categoryAxis.renderer.grid.template.disabled = true
  categoryAxis.renderer.labels.template.paddingRight = 25
  categoryAxis.renderer.minGridDistance = 10
  categoryAxis.renderer.innerRadius = -60
  categoryAxis.renderer.radius = 60

  var dateAxis = chart.xAxes.push(new am4charts.DateAxis())
  dateAxis.renderer.minGridDistance = 70
  dateAxis.baseInterval = [
    { count: 1, timeUnit: "week" },
    { count: 1, timeUnit: "mounth" },
  ]
  dateAxis.renderer.tooltipLocation = 0
  dateAxis.startLocation = -0.5
  dateAxis.renderer.line.strokeDasharray = "1,4"
  dateAxis.renderer.line.strokeOpacity = 0.6
  dateAxis.tooltip.background.fillOpacity = 0.2
  dateAxis.tooltip.background.cornerRadius = 5
  dateAxis.tooltip.label.fill = new am4core.InterfaceColorSet().getFor(
    "alternativeBackground"
  )
  dateAxis.tooltip.label.paddingTop = 7

  var labelTemplate = dateAxis.renderer.labels.template
  labelTemplate.verticalCenter = "middle"
  labelTemplate.fillOpacity = 0.7
  labelTemplate.background.fill = new am4core.InterfaceColorSet().getFor(
    "background"
  )
  labelTemplate.background.fillOpacity = 1
  labelTemplate.padding(7, 7, 7, 7)

  var series = chart.series.push(new am4plugins_timeline.CurveColumnSeries())
  series.columns.template.height = am4core.percent(20)
  series.columns.template.tooltipText =
    "{description}: [bold]{openDateX}[/] - [bold]{dateX}[/]"

  series.dataFields.openDateX = "start"
  series.dataFields.dateX = "end"
  series.dataFields.categoryY = "category"
  series.columns.template.propertyFields.fill = "color" // get color from data
  series.columns.template.propertyFields.stroke = "color"
  series.columns.template.strokeOpacity = 0

  var bullet = series.bullets.push(new am4charts.CircleBullet())
  bullet.circle.radius = 3
  bullet.circle.strokeOpacity = 0
  bullet.propertyFields.fill = "color"
  bullet.locationX = 0

  var bullet2 = series.bullets.push(new am4charts.CircleBullet())
  bullet2.circle.radius = 3
  bullet2.circle.strokeOpacity = 0
  bullet2.propertyFields.fill = "color"
  bullet2.locationX = 1

  chart.scrollbarX = new am4core.Scrollbar()
  chart.scrollbarX.align = "center"
  chart.scrollbarX.width = am4core.percent(85)

  var cursor = new am4plugins_timeline.CurveCursor()
  chart.cursor = cursor
  cursor.xAxis = dateAxis
  cursor.yAxis = categoryAxis
  cursor.lineY.disabled = true
  cursor.lineX.strokeDasharray = "1,4"
  cursor.lineX.strokeOpacity = 1

  dateAxis.renderer.tooltipLocation2 = 0
  categoryAxis.cursorTooltipEnabled = false
  return chart
}

export const TimeLine = props => {
  const divName = "chartdiv"

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
  }, [setState, state, state.initialize, state.chart])

  if (state?.chart) {
    state.chart.data = props.data
  }

  return <div id="chartdiv" style={{ width: "95%", height: "800px" }}></div>
}

/* // Themes begin
am4core.useTheme(am4themes_animated);
// Themes end

var chart = am4core.create("chartdiv", am4plugins_timeline.CurveChart);
chart.curveContainer.padding(150, 20, 150, 20);

var colorSet = new am4core.ColorSet();
colorSet.saturation = 0.5;

chart.data =  ;

chart.dateFormatter.dateFormat = "yyyy-MM-dd HH:MM";
chart.dateFormatter.inputDateFormat = "yyyy-MM-dd HH:MM";
chart.fontSize = 11;

var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
categoryAxis.dataFields.category = "category";
categoryAxis.renderer.grid.template.disabled = true;
categoryAxis.renderer.labels.template.paddingRight = 25;
categoryAxis.renderer.minGridDistance = 10;
categoryAxis.renderer.innerRadius = -60;
categoryAxis.renderer.radius = 60;

var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
dateAxis.renderer.minGridDistance = 70;
dateAxis.baseInterval = [{ count: 1, timeUnit: "day" },{ count: 1, timeUnit: "week" },{ count: 1, timeUnit: "mounth" }];
dateAxis.renderer.tooltipLocation = 0;
dateAxis.startLocation = -0.5;
dateAxis.renderer.line.strokeDasharray = "1,4";
dateAxis.renderer.line.strokeOpacity = 0.6;
dateAxis.tooltip.background.fillOpacity = 0.2;
dateAxis.tooltip.background.cornerRadius = 5;
dateAxis.tooltip.label.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
dateAxis.tooltip.label.paddingTop = 7;

var labelTemplate = dateAxis.renderer.labels.template;
labelTemplate.verticalCenter = "middle";
labelTemplate.fillOpacity = 0.7;
labelTemplate.background.fill = new am4core.InterfaceColorSet().getFor("background");
labelTemplate.background.fillOpacity = 1;
labelTemplate.padding(7, 7, 7, 7);

var series = chart.series.push(new am4plugins_timeline.CurveColumnSeries());
series.columns.template.height = am4core.percent(20);
series.columns.template.tooltipText = "{value}: [bold]{openDateX}[/] - [bold]{dateX}[/]";

series.dataFields.openDateX = "start";
series.dataFields.dateX = "end";
series.dataFields.categoryY = "category";
series.columns.template.propertyFields.fill = "color"; // get color from data
series.columns.template.propertyFields.stroke = "color";
series.columns.template.strokeOpacity = 0;

var bullet = series.bullets.push(new am4charts.CircleBullet());
bullet.circle.radius = 3;
bullet.circle.strokeOpacity = 0;
bullet.propertyFields.fill = "color";
bullet.locationX = 0;


var bullet2 = series.bullets.push(new am4charts.CircleBullet());
bullet2.circle.radius = 3;
bullet2.circle.strokeOpacity = 0;
bullet2.propertyFields.fill = "color";
bullet2.locationX = 1;





chart.scrollbarX = new am4core.Scrollbar();
chart.scrollbarX.align = "center"
chart.scrollbarX.width = am4core.percent(85);

var cursor = new am4plugins_timeline.CurveCursor();
chart.cursor = cursor;
cursor.xAxis = dateAxis;
cursor.yAxis = categoryAxis;
cursor.lineY.disabled = true;
cursor.lineX.strokeDasharray = "1,4";
cursor.lineX.strokeOpacity = 1;

dateAxis.renderer.tooltipLocation2 = 0;
categoryAxis.cursorTooltipEnabled = false; */
