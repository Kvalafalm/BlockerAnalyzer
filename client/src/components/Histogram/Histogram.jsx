import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { useEffect, useLayoutEffect, useState } from "react";

am4core.useTheme(am4themes_animated);

const initializeChart = (divName) => {
    const chart = am4core.create(divName, am4charts.XYChart)
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "day";
    categoryAxis.renderer.grid.template.location = 0;

    chart.cursor = new am4charts.XYCursor();
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.renderer.inside = true;
    valueAxis.renderer.labels.template.disabled = true;
    valueAxis.min = 0;

    // Create series
    chart.series.createSeries = (chart, field, name) => {

        let series = chart.series.push(new am4charts.ColumnSeries());
        series.name = name;
        series.dataFields.valueY = field;
        series.dataFields.categoryX = "day";
        series.dataFields.categoryY = "html" + name;
        series.sequencedInterpolation = true;

        series.stacked = true;

        series.columns.template.width = am4core.percent(60);
        series.columns.template.tooltipHTML = `<b>#{name},</b>\n<span>{categoryX} дней: {valueY}шт</span>
        <br>
        <span>
        {categoryY}
        </span>
        `;
        series.tooltip.label.interactionsEnabled = true;
        series.tooltip.keepTargetHover = true;
        // Add label
        let labelBullet = series.bullets.push(new am4charts.LabelBullet());
        labelBullet.label.text = "{valueY}";
        labelBullet.locationY = 0.5;
        labelBullet.label.hideOversized = true;

        return series;
    }

    // Legend
    chart.legend = new am4charts.Legend();
    return chart
}

export const Histogram = (props) => {
    const divName = "chartdiv"

    const [state, setState] = useState({ chart: null, initialize: false })


    useEffect(() => {
        if (!state.initialize) {

            setState({
                ...state,
                createSerials: true,
                initialize: true,
                chart: initializeChart(divName)
            })
        }
    }, [setState, state, state.initialize, state.chart])


    useEffect(() => {
        if (state.initialize) {

            while (state.chart.series.length > 0) {
                state.chart.series.removeIndex(0).dispose();
            }

            props.seriesChart.forEach(element => {
                state.chart.series.createSeries(state.chart, element, element);
            });

        }
    }, [props, state.initialize, state.chart])

    if (state?.chart) {
        state.chart.data = props.data
    }
    
    return (
        <div id="chartdiv" style={{ width: "100%", height: "800px" }}>

        </div>
    )

}