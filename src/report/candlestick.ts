import * as d3 from 'd3';
import jsdom from 'jsdom';
import { Quote } from '../coinapi';

// Based on: https://observablehq.com/@d3/candlestick-chart

export const candlestickChart = (quotesData: Quote[], {
    marginTop = 20, // top margin, in pixels
    marginRight = 30, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 40, // left margin, in pixels
    width = 800, // outer width, in pixels
    height = 500, // outer height, in pixels
    stroke = 'currentColor', // stroke color for the daily rule
    colors = ['#4daf4a', '#999999', '#e41a1c'] // [up, no change, down]
} = {}) => {
    // Compute domains
    const xDomain = [d3.min(quotesData, (d: Quote) => d.start), d3.max(quotesData, (d: Quote) => d.end)];
    const yDomain = [d3.min(quotesData, (d: Quote) => d.rate.low), d3.max(quotesData, (d: Quote) => d.rate.high)];

    // Create scales and axis
    const xRange = [marginLeft, width - marginRight];
    const xScale = d3.scaleTime().domain(xDomain).range(xRange);
    const yScale = d3.scaleLinear(yDomain, [height - marginBottom, marginTop]);
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale).ticks(height / 40);

    const { JSDOM } = jsdom;
    const { document } = (new JSDOM('')).window;
    global.document = document;

    const body = d3.select(document).select('body');

    const svg = body.append('svg')
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', [0, 0, width, height])
        .attr('style', 'max-width: 100%; height: auto; height: intrinsic;');

    svg.append('g')
        .attr('transform', `translate(0,${height - marginBottom})`)
        .call(xAxis)
        .call(g => g.select('.domain').remove());

    svg.append('g')
        .attr('transform', `translate(${marginLeft},0)`)
        .call(yAxis)
        .call(g => g.select('.domain').remove())
        .call(g => g.selectAll('.tick line').clone()
            .attr('stroke-opacity', 0.2)
            .attr('x2', width - marginLeft - marginRight))
        .call(g => g.append('text')
            .attr('x', -marginLeft)
            .attr('y', 10)
            .attr('fill', 'currentColor')
            .attr('text-anchor', 'start')
            .text('USD'));

    const g = svg.append('g')
        .attr('stroke', stroke)
        .selectAll('g')
        .data(quotesData)
        .join('g')
        .attr('transform', (d: Quote) => `translate(${xScale(d.date)},0)`);

    g.append('line')
        .attr('y1', (d: Quote) => yScale(d.rate.low))
        .attr('y2', (d: Quote) => yScale(d.rate.high));

    g.append('line')
        .attr('y1', (d: Quote) => yScale(d.rate.open))
        .attr('y2', (d: Quote) => yScale(d.rate.close))
        .attr('stroke-width', (xRange[1] - xRange[0]) / quotesData.length * 0.8)
        .attr('stroke', (d: Quote) => colors[1 + Math.sign(d.rate.open - d.rate.close)]);

    const node = body.node() as { innerHTML: string }

    return node.innerHTML;
}
