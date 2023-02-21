import * as d3 from 'd3';
import jsdom from 'jsdom';
import { Quote } from './coinapi';

// Based on: https://observablehq.com/@d3/candlestick-chart

export function candlestickChart(data: Quote[], {
    marginTop = 20, // top margin, in pixels
    marginRight = 30, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 40, // left margin, in pixels
    width = 800, // outer width, in pixels
    height = 500, // outer height, in pixels
    xRange = [marginLeft, width - marginRight], // [left, right]
    yType = d3.scaleLinear, // type of y-scale
    yRange = [height - marginBottom, marginTop], // [bottom, top]
    xFormat = "%b %-d", // a format specifier for the date on the x-axis
    yFormat = "~f", // a format specifier for the value on the y-axis
    yLabel = '', // a label for the y-axis
    stroke = "currentColor", // stroke color for the daily rule
    colors = ["#4daf4a", "#999999", "#e41a1c"] // [up, no change, down]
} = {}) {
    // Compute values
    const X = d3.map(data, (d: Quote) => d.date);
    const Yo = d3.map(data, (d: Quote) => d.rate.open);
    const Yc = d3.map(data, (d: Quote) => d.rate.close)
    const Yh = d3.map(data, (d: Quote) => d.rate.high)
    const Yl = d3.map(data, (d: Quote) => d.rate.low)
    const I = d3.range(data.length);
    const strokeWidth = (xRange[1] - xRange[0]) / X.length * 0.8;

    // Compute default domains and ticks.
    const xDomain = [d3.min(data, (d: Quote) => d.start), d3.max(data, (d: Quote) => d.end)];
    const yDomain = [d3.min(Yl), d3.max(Yh)];

    // Create scales and axis
    const xScale = d3.scaleTime().domain(xDomain).range(xRange);
    const yScale = yType(yDomain, yRange);
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.utcFormat(xFormat));
    const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);

    const { JSDOM } = jsdom;
    const { document } = (new JSDOM('')).window;
    global.document = document;

    const body = d3.select(document).select('body');

    const svg = body.append('svg')
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(xAxis)
        .call(g => g.select(".domain").remove());

    svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(yAxis)
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick line").clone()
            .attr("stroke-opacity", 0.2)
            .attr("x2", width - marginLeft - marginRight))
        .call(g => g.append("text")
            .attr("x", -marginLeft)
            .attr("y", 10)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .text(yLabel));

    const g = svg.append("g")
        .attr("stroke", stroke)
        .selectAll("g")
        .data(I)
        .join("g")
        .attr("transform", (i: number) => `translate(${xScale(X[i])},0)`);

    g.append("line")
        .attr("y1", (i: number) => yScale(Yl[i]))
        .attr("y2", (i: number) => yScale(Yh[i]));

    g.append("line")
        .attr("y1", (i: number) => yScale(Yo[i]))
        .attr("y2", (i: number) => yScale(Yc[i]))
        .attr("stroke-width", strokeWidth)
        .attr("stroke", (i: number) => colors[1 + Math.sign(Yo[i] - Yc[i])]);

    const node = body.node() as { innerHTML: string }

    return node.innerHTML;
}
