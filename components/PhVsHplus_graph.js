const React = require("react");
const D3Component = require("idyll-d3-component");
const d3 = require("d3");

const phData = [
  // { ph: 5, hplus: 0.000009999999999999999 },
  // { ph: 5.25, hplus: 0.00000562341325190349 },
  // { ph: 5.5, hplus: 0.000003162277660168379 },
  // { ph: 5.75, hplus: 0.000001778279410038923 },
  { ph: 6, hplus: 0.000001 },
  { ph: 6.25, hplus: 5.62341325190349e-7 },
  { ph: 6.5, hplus: 3.162277660168379e-7 },
  { ph: 6.75, hplus: 1.7782794100389227e-7 },
  { ph: 7, hplus: 1e-7 },
  { ph: 7.25, hplus: 5.6234132519034905e-8 },
  { ph: 7.5, hplus: 3.162277660168379e-8 },
  { ph: 7.75, hplus: 1.7782794100389228e-8 },
  { ph: 8, hplus: 1e-8 },
  { ph: 8.25, hplus: 5.623413251903491e-9 },
  { ph: 8.5, hplus: 3.1622776601683795e-9 },
  { ph: 8.75, hplus: 1.7782794100389228e-9 },
  { ph: 9, hplus: 1e-9 },
  // { ph: 9.25, hplus: 5.623413251903491e-10 },
  // { ph: 9.5, hplus: 3.1622776601683795e-10 },
  // { ph: 9.75, hplus: 1.7782794100389226e-10 },
  // { ph: 10, hplus: 1e-10 },
];

const size = 600;

const superPlus = "\u207A";

// NB: When needed, over-ride round() in generalConversions
const round = (value, decimals) =>
  Number(Math.round(value + "e" + decimals) + "e-" + decimals);

class PhVsHplus_graph extends D3Component {
  initialize(node, props) {
    const svg = (this.svg = d3.select(node).append("svg"));

    const { ph_1, hPlus_1 } = props;

    // const real_hPlus_1 = hPlus_1 / Math.pow(10, 9);

    // PH INPUT -- build the pH data to plot
    // MODIFIED FROM more complicated PhVsHplus_posto
    const phEntryData = [
      {
        ph: ph_1,
        hplus: Math.pow(10, -ph_1),
        color: "green",
        start: ph_1,
      },
    ];

    svg
      .attr("viewBox", `0 0 600 650`)
      .style("width", "590")
      .style("height", "400");

    // ACCESSORS
    const xAccessor = (d) => d.hplus;
    const yAccessor = (d) => d.ph;

    // SCALES
    let xScale = d3
      .scaleLinear()
      .domain([0, 0.000001])
      // .domain(d3.extent(phData, xAccessor))
      .range([0, 750]);

    let yScale = d3
      .scaleLinear()
      .domain([6, 9])
      // .domain(d3.extent(phData, yAccessor))
      .range([550, 100]);

    // TITLE
    // svg
    //   .append("text")
    //   .attr("class", "title-label")
    //   .attr("x", size / 2)
    //   .attr("y", 55)
    //   .style("font-size", "3.0rem")
    //   .text(`pH vs. [H${superPlus}]`)
    //   .attr("text-anchor", "middle")
    //   .attr("fill", "#646464");

    // ********************* //
    // ****** PH LINE ****** //
    // ********************* //

    // see: https://bl.ocks.org/EfratVil/c022f78e258d869f5ebae54d7fc20aed
    const linearGradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", "linear-gradient")
      .attr("gradientTransform", "rotate(90)");

    linearGradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "blue");

    linearGradient
      .append("stop")
      .attr("offset", "80%")
      .attr("stop-color", "#7F007F");

    linearGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "red");

    // ************** //
    // ** THE PATH ** //
    // ************** //
    // "...a single path SVG element. path elements take a d attribute..." -Amelia Whataburger
    const lineGenerator = d3
      .line()
      .x((d) => xScale(xAccessor(d)))
      .y((d) => yScale(yAccessor(d)))
      .curve(d3.curveMonotoneX);

    const line = svg
      .append("path")
      .attr("d", lineGenerator(phData))
      .attr("fill", "none")
      .attr("stroke", "url(#linear-gradient)")
      .attr("stroke-width", 4);

    // ********************** //
    // ****** PH INPUT ****** //
    // ********************** //

    // PH INPUT LINES
    svg
      .selectAll(".ph-line-to-x")
      .data(phEntryData)
      .enter()
      .append("line")
      .attr("class", "ph-line-to-x")
      .transition()
      .duration(750)
      .attr("stroke", "green")
      .attr("stroke-opacity", 0.35)
      .style("stroke-width", 3)
      .attr("x1", (d) => xScale(xAccessor(d)))
      .attr("y1", (d) => yScale(yAccessor(d)))
      .attr("x2", (d) => xScale(xAccessor(d)))
      .attr("y2", 550);

    svg
      .selectAll(".ph-line-to-y")
      .data(phEntryData)
      .enter()
      .append("line")
      .attr("class", "ph-line-to-y")
      .transition()
      .duration(750)
      .attr("stroke", "green")
      .attr("stroke-opacity", 0.35)
      .style("stroke-width", 3)
      .attr("x1", (d) => xScale(xAccessor(d)))
      .attr("y1", (d) => yScale(yAccessor(d)))
      .attr("x2", -25)
      .attr("y2", (d) => yScale(yAccessor(d)));

    // [TEST] LINE: TARGET CIRCLE TO STATEMENT
    // 'start' property FALSE => the target pH (larger circle)
    svg
      .selectAll(".ph-target-to-statement")
      .data(phEntryData)
      .enter()
      .append("line")
      .attr("class", "ph-target-to-statement")
      .transition()
      .duration(750)
      .attr("stroke", "green") // !d.start => target pH
      .attr("stroke-opacity", 0.55)
      .style("stroke-width", 5)
      .attr("x1", 340)
      .attr("y1", 210)
      .attr("x2", (d) => xScale(d.hplus))
      .attr("y2", (d) => yScale(d.ph));

    // PH LINE CIRCLES
    let circles = svg
      .selectAll("circle")
      .data(phEntryData)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(xAccessor(d)))
      .attr("cy", (d) => yScale(yAccessor(d)))
      .attr("r", 13)
      // .attr("fill", "url(#linear-gradient)");
      .attr("fill", "green");
    // .attr("opacity", 0.55);

    // ************************ //
    // ***** AXES CIRCLES ***** //
    // ************************ //

    // PH Y-AXIS CIRCLES
    svg
      .selectAll(".ph-yaxis-markers")
      .data(phEntryData)
      .enter()
      .append("circle")
      .attr("class", "ph-yaxis-markers")
      .attr("cx", -24.5)
      .attr("cy", (d) => yScale(yAccessor(d)))
      .attr("r", 7.0)
      // .attr("r", (d) => (d.start ? 7 : 4.5))
      // .attr("r", 6.5)
      .attr("fill", (d) => d.color);

    // PH X-AXIS CIRCLES
    svg
      .selectAll(".ph-xaxis-markers")
      .data(phEntryData)
      .enter()
      .append("circle")
      .attr("class", "ph-xaxis-markers")
      .attr("cx", (d) => xScale(xAccessor(d)))
      .attr("cy", 550)
      .attr("r", 7.0)
      .attr("fill", "green");

    // ********************** //
    // **** RESULT "DIV" **** //
    // ********************** //

    svg
      .append("rect")
      .attr("class", "result-rect")
      .attr("x", 120)
      .attr("y", 100)
      .attr("width", 680)
      .attr("height", 220)
      .attr("stroke", "green")
      // .attr("stroke", "#808080")
      .attr("stroke-width", 2)
      .attr("rx", 30) // [NB] D3 round rect corners
      .attr("fill", "#FFFFDD");

    // *********************** //
    // **** RESULT LABELS **** //
    // *********************** //

    // PH CHANGE
    svg
      .append("text")
      .attr("class", "ph-change-label")
      .attr("x", 184)
      .attr("y", 180)
      .style("font-size", "2.5rem")
      .style("font-weight", "400")
      .text(`  pH: ${round(ph_1, 2)} pH units`)
      .attr("text-anchor", "start")
      .attr("fill", "green")
      .attr("opacity", 0.8);
    // .attr("fill", "#808080");

    // [H+] CHANGE
    svg
      .append("text")
      .attr("class", "hplus-change-label")
      .attr("x", 165)
      .attr("y", 270)
      .style("font-size", "2.5rem")
      .style("font-weight", "400")
      .text(`  [H${superPlus}]: ${phEntryData[0].hplus.toFixed(12)} mol/L`)
      .attr("text-anchor", "start")
      .attr("fill", "green")
      .attr("opacity", 0.8);

    // ********************** //
    // ******** AXES ******** //
    // ********************** //

    // X-AXES
    const xAxisGenerator = d3.axisBottom().scale(xScale).tickValues([
      // 1e-8,
      // 3.162277660168379e-8,
      1e-7,
      3.162277660168379e-7,
      5.62341325190349e-7,
      0.000001,
    ]);
    // const xAxisGenerator = d3.axisBottom().scale(xScale).ticks(3);
    const xAxis = svg
      .append("g")
      .call(xAxisGenerator)
      .style("transform", `translate(0,${550}px)`)
      .selectAll(".tick text")
      .attr("font-size", "25");

    // Y-AXES
    const yAxisGenerator = d3.axisLeft().scale(yScale).ticks(7);
    const yAxis = svg
      .append("g")
      .call(yAxisGenerator)
      .style("transform", `translateX(-25px)`)
      .selectAll(".tick text")
      .attr("font-size", "25");

    // AXIS LABELS
    svg
      .append("text")
      .attr("x", 380)
      .attr("y", 620)
      .style("text-anchor", "middle")
      .attr("fill", "#808080")
      .style("font-size", "2.0rem")
      .html(`[H${superPlus}] (mol/L)`);

    svg
      .append("text")
      .attr("x", -330)
      .attr("y", -90)
      .attr("fill", "#808080")
      .style("font-size", "2.0rem")
      .style("transform", "rotate(-90deg)")
      .style("text-anchor", "middle")
      .html(`pH (NBS)`);

    // **************************** //
    // **** END INITIALIZE() **** //
    // **************************** //
  }

  // ****************************** //
  // ****************************** //
  // ****** IDYLL's UPDATE() ****** //
  // ****************************** //
  // ****************************** //

  update(props, oldProps) {
    const { ph_1, hPlus_1 } = props;

    // const real_hPlus_1 = hPlus_1 / Math.pow(10, 9);

    // "UPDATE" SCALES
    let xScale = d3.scaleLinear().domain([0, 0.000001]).range([0, 750]);
    let yScale = d3.scaleLinear().domain([6, 9]).range([550, 100]);

    // GET NEW PH INPUT
    // MODIFIED FROM more complicated PhVsHplus_posto
    const phEntryData = [
      {
        ph: ph_1,
        hplus: Math.pow(10, -ph_1),
        color: "green",
        start: ph_1,
      },
    ];

    // PH CIRCLES
    this.svg
      .selectAll("circle")
      .data(phEntryData)
      .transition()
      .duration(750)
      .attr("cx", (d) => xScale(d.hplus))
      .attr("cy", (d) => yScale(d.ph))
      .attr("r", 13)
      .attr("fill", "green");
    // .attr("opacity", 0.45);

    // PH Y-AXIS CIRCLES
    this.svg
      .selectAll(".ph-yaxis-markers")
      .data(phEntryData)
      .transition()
      .duration(750)
      .attr("cy", (d) => yScale(d.ph))
      .attr("r", 7.0)
      .attr("fill", (d) => d.color);

    // PH X-AXIS CIRCLES
    this.svg
      .selectAll(".ph-xaxis-markers")
      .data(phEntryData)
      .transition()
      .duration(750)
      .attr("cx", (d) => xScale(d.hplus))
      .attr("r", 7.0)
      .attr("fill", (d) => d.color);

    // [TEST] LINE: TARGET CIRCLE TO STATEMENT
    // 'start' property FALSE => the target pH (larger circle)
    this.svg
      .selectAll(".ph-target-to-statement")
      .data(phEntryData)
      .transition()
      .duration(750)
      .attr("opacity", 1) // !d.start => target pH
      .attr("stroke", "green") // !d.start => target pH
      .attr("x2", (d) => xScale(d.hplus))
      .attr("y2", (d) => yScale(d.ph));

    // PH Y-AXIS ARROW
    // this.svg
    //   .selectAll(".ph-yaxis-arrow")
    //   .data(phEntryData)
    //   .transition()
    //   .duration(750)
    //   .attr("stroke", (d) => (d.start ? d.color : ""))
    //   .attr("y1", yScale(phEntryData[0].ph))
    //   .attr("y2", yScale(phEntryData[1].ph));

    // // PH INPUT LINES
    this.svg
      .selectAll(".ph-line-to-x")
      .data(phEntryData)
      .transition()
      .duration(750)
      .attr("x1", (d) => xScale(d.hplus))
      .attr("y1", (d) => yScale(d.ph))
      .attr("x2", (d) => xScale(d.hplus))
      .attr("y2", (d) => 550)
      .attr("stroke", (d) => d.color)
      .attr("stroke-opacity", 0.35);

    this.svg
      .selectAll(".ph-line-to-y")
      .data(phEntryData)
      .transition()
      .duration(750)
      .attr("x1", (d) => xScale(d.hplus))
      .attr("y1", (d) => yScale(d.ph))
      .attr("x2", -25)
      .attr("y2", (d) => yScale(d.ph));

    this.svg.selectAll(".result-rect").attr("stroke", "green");

    // RESULT TEXT
    this.svg
      .selectAll(".ph-change-label")
      .transition()
      .duration(500)
      .text(`  pH: ${round(ph_1, 2)} pH units`)
      .attr("fill", "green");

    this.svg
      .selectAll(".hplus-change-label")
      .transition()
      .duration(500)
      // .text(`Δ [H${superPlus}]: ${real_hPlus_1.toFixed(12)} mol/L`)
      .text(`  [H${superPlus}]: ${phEntryData[0].hplus.toFixed(12)} mol/L`)
      .attr("fill", "green");

    // ******************* //
    // ** END OF UPDATE ** //
    // ******************* //
  }
}

module.exports = PhVsHplus_graph;
