import * as d3 from 'd3';
import jsdom from 'jsdom';

export const generateD3Report = () => {
    const { JSDOM } = jsdom;

    const { document } = (new JSDOM('')).window;
    global.document = document;

    const body = d3.select(document).select('body');

    const width = 300;
    const height = 300;
    const svg = body.append('svg')
        .attr('width', width)
        .attr('height', height);
    svg.append('line')
        .attr('x1', 100)
        .attr('y1', 100)
        .attr('x2', 200)
        .attr('y2', 200)
        .style('stroke', 'rgb(255,0,0)')
        .style('stroke-width', 2);

    return body.node().innerHTML;
}
