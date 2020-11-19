const React = require("react");
const D3Component = require("idyll-d3-component");
const d3 = require("d3");

// ** fill ionic strength vs. salinity in console
// const mySals = Array(41).fill().map((x, idx) => idx)
// mySals.map((sal, idx) => {return {sal: sal, is: (19.924 * sal) / (1000.0 - 1.005 * sal)}})

const ionicStrengthData = [
  { sal: 0, is: 0 },
  { sal: 1, is: 0.019944043763982802 },
  { sal: 2, is: 0.03992825579414623 },
  { sal: 3, is: 0.059952757564055624 },
  { sal: 4, is: 0.08001767103757103 },
  { sal: 5, is: 0.1001231186713234 },
  { sal: 6, is: 0.12026922341720575 },
  { sal: 7, is: 0.1404561087248795 },
  { sal: 8, is: 0.16068389854429613 },
  { sal: 9, is: 0.18095271732823387 },
  { sal: 10, is: 0.20126269003485026 },
  { sal: 11, is: 0.2216139421302499 },
  { sal: 12, is: 0.24200659959106827 },
  { sal: 13, is: 0.2624407889070709 },
  { sal: 14, is: 0.28291663708376863 },
  { sal: 15, is: 0.30343427164504916 },
  { sal: 16, is: 0.32399382063582405 },
  { sal: 17, is: 0.34459541262469284 },
  { sal: 18, is: 0.3652391767066228 },
  { sal: 19, is: 0.3859252425056453 },
  { sal: 20, is: 0.40665374017756917 },
  { sal: 21, is: 0.42742480041271025 },
  { sal: 22, is: 0.44823855443863825 },
  { sal: 23, is: 0.4690951340229403 },
  { sal: 24, is: 0.4899946714760011 },
  { sal: 25, is: 0.5109372996538017 },
  { sal: 26, is: 0.531923151960734 },
  { sal: 27, is: 0.5529523623524333 },
  { sal: 28, is: 0.574025065338629 },
  { sal: 29, is: 0.5951413959860122 },
  { sal: 30, is: 0.6163014899211219 },
  { sal: 31, is: 0.6375054833332473 },
  { sal: 32, is: 0.6587535129773516 },
  { sal: 33, is: 0.6800457161770105 },
  { sal: 34, is: 0.7013822308273712 },
  { sal: 35, is: 0.7227631953981292 },
  { sal: 36, is: 0.7441887489365234 },
  { sal: 37, is: 0.7656590310703509 },
  { sal: 38, is: 0.7871741820110001 },
  { sal: 39, is: 0.808734342556502 },
  { sal: 40, is: 0.8303396540946031 },
];

const size = 600;

const superPlus = "\u207A";

// NB: When needed, over-ride round() in generalConversions
const round = (value, decimals) =>
  Number(Math.round(value + "e" + decimals) + "e-" + decimals);

class IonicStrength extends D3Component {
  initialize(node, props) {
    const svg = (this.svg = d3.select(node).append("svg"));

    const { sal } = props;
    // console.log(`1. IS: ${sal}`);

    // SALINITY INPUT -- build the pH data to plot
    // MODIFIED FROM more complicated PhVsHplus_posto
    const salEntryData = [
      {
        sal: sal,
        is: (19.924 * sal) / (1000.0 - 1.005 * sal),
        color: "green",
        start: sal,
      },
    ];

    svg
      .attr("viewBox", `0 0 600 650`)
      .style("width", "590")
      .style("height", "400");

    // ACCESSORS
    const xAccessor = (d) => d.sal;
    const yAccessor = (d) => d.is;

    // SCALES
    let xScale = d3.scaleLinear().domain([0, 40]).range([0, 750]);

    let yScale = d3.scaleLinear().domain([0, 1]).range([550, 100]);

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
    // const linearGradient = svg
    //   .append("defs")
    //   .append("linearGradient")
    //   .attr("id", "linear-gradient")
    //   .attr("gradientTransform", "rotate(90)");

    // linearGradient
    //   .append("stop")
    //   .attr("offset", "0%")
    //   .attr("stop-color", "red");

    // linearGradient
    //   .append("stop")
    //   .attr("offset", "80%")
    //   .attr("stop-color", "yellow");

    // linearGradient
    //   .append("stop")
    //   .attr("offset", "100%")
    //   .attr("stop-color", "green");

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
      .attr("d", lineGenerator(ionicStrengthData))
      .attr("fill", "none")
      .attr("stroke", "navy")
      // .attr("stroke", "url(#linear-gradient)")
      .attr("stroke-width", 4);

    // ********************** //
    // ****** PH INPUT ****** //
    // ********************** //

    // SALINITY INPUT LINES
    svg
      .selectAll(".sal-line-to-x")
      .data(salEntryData)
      .enter()
      .append("line")
      .attr("class", "sal-line-to-x")
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
      .selectAll(".sal-line-to-y")
      .data(salEntryData)
      .enter()
      .append("line")
      .attr("class", "sal-line-to-y")
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
    // svg
    //   .selectAll(".sal-target-to-statement")
    //   .data(ionicStrengthData)
    //   .enter()
    //   .append("line")
    //   .attr("class", "sal-target-to-statement")
    //   .transition()
    //   .duration(750)
    //   .attr("stroke", "green") // !d.start => target pH
    //   .attr("stroke-opacity", 0.55)
    //   .style("stroke-width", 5)
    //   .attr("x1", 340)
    //   .attr("y1", 210)
    //   .attr("x2", (d) => xScale(d.sal))
    //   .attr("y2", (d) => yScale(d.ic));

    // SALINITY LINE CIRCLES
    let circles = svg
      .selectAll("circle")
      .data(salEntryData)
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

    // IONIC STRENGTH Y-AXIS CIRCLES
    svg
      .selectAll(".sal-yaxis-markers")
      .data(salEntryData)
      .enter()
      .append("circle")
      .attr("class", "sal-yaxis-markers")
      .attr("cx", -24.5)
      .attr("cy", (d) => yScale(yAccessor(d)))
      .attr("r", 7.0)
      // .attr("r", (d) => (d.start ? 7 : 4.5))
      // .attr("r", 6.5)
      .attr("fill", (d) => d.color);

    // PH X-AXIS CIRCLES
    svg
      .selectAll(".sal-xaxis-markers")
      .data(salEntryData)
      .enter()
      .append("circle")
      .attr("class", "sal-xaxis-markers")
      .attr("cx", (d) => xScale(xAccessor(d)))
      .attr("cy", 550)
      .attr("r", 7.0)
      .attr("fill", "green");

    // ********************** //
    // **** RESULT "DIV" **** //
    // ********************** //

    // svg
    //   .append("rect")
    //   .attr("class", "result-rect")
    //   .attr("x", 120)
    //   .attr("y", 100)
    //   .attr("width", 680)
    //   .attr("height", 220)
    //   .attr("stroke", "green")
    //   // .attr("stroke", "#808080")
    //   .attr("stroke-width", 2)
    //   .attr("rx", 30) // [NB] D3 round rect corners
    //   .attr("fill", "#FFFFDD");

    // *********************** //
    // **** RESULT LABELS **** //
    // *********************** //

    // // PH CHANGE
    // svg
    //   .append("text")
    //   .attr("class", "ph-change-label")
    //   .attr("x", 184)
    //   .attr("y", 180)
    //   .style("font-size", "2.5rem")
    //   .style("font-weight", "400")
    //   .text(`  pH: ${round(ph_1, 2)} pH units`)
    //   .attr("text-anchor", "start")
    //   .attr("fill", "green")
    //   .attr("opacity", 0.8);
    // // .attr("fill", "#808080");

    // // [H+] CHANGE
    // svg
    //   .append("text")
    //   .attr("class", "hplus-change-label")
    //   .attr("x", 165)
    //   .attr("y", 270)
    //   .style("font-size", "2.5rem")
    //   .style("font-weight", "400")
    //   .text(`  [H${superPlus}]: ${phEntryData[0].hplus.toFixed(12)} mol/L`)
    //   .attr("text-anchor", "start")
    //   .attr("fill", "green")
    //   .attr("opacity", 0.8);

    // ********************** //
    // ******** AXES ******** //
    // ********************** //

    // X-AXES
    const xAxisGenerator = d3.axisBottom().scale(xScale);
    // .tickValues([
    //   // 1e-8,
    //   // 3.162277660168379e-8,
    //   1e-7,
    //   3.162277660168379e-7,
    //   5.62341325190349e-7,
    //   0.000001,
    // ]);
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
      .html(`Salinity (‰)`);
    // .html(`[H${superPlus}] (mol/L)`);

    svg
      .append("text")
      .attr("x", -330)
      .attr("y", -90)
      .attr("fill", "#808080")
      .style("font-size", "2.0rem")
      .style("transform", "rotate(-90deg)")
      .style("text-anchor", "middle")
      .html(`Ionic Strength (mol/kg)`);

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
    const { sal } = props;
    // console.log(`2. IS: ${sal}`);

    // "UPDATE" SCALES
    let xScale = d3.scaleLinear().domain([0, 40]).range([0, 750]);
    let yScale = d3.scaleLinear().domain([0, 1]).range([550, 100]);

    // // GET NEW PH INPUT
    // // MODIFIED FROM more complicated PhVsHplus_posto
    const salEntryData = [
      {
        sal: sal,
        is: (19.924 * sal) / (1000.0 - 1.005 * sal),
        color: "green",
        start: sal,
      },
    ];

    // PH CIRCLES
    this.svg
      .selectAll("circle")
      .data(salEntryData)
      .transition()
      .duration(750)
      .attr("cx", (d) => xScale(d.sal))
      .attr("cy", (d) => yScale(d.is))
      .attr("r", 13)
      .attr("fill", "green");
    // .attr("opacity", 0.45);

    // PH Y-AXIS CIRCLES
    this.svg
      .selectAll(".sal-yaxis-markers")
      .data(salEntryData)
      .transition()
      .duration(750)
      .attr("cy", (d) => yScale(d.is))
      .attr("r", 7.0)
      .attr("fill", (d) => d.color);

    // PH X-AXIS CIRCLES
    this.svg
      .selectAll(".sal-xaxis-markers")
      .data(salEntryData)
      .transition()
      .duration(750)
      .attr("cx", (d) => xScale(d.sal))
      .attr("r", 7.0)
      .attr("fill", (d) => d.color);

    // // [TEST] LINE: TARGET CIRCLE TO STATEMENT
    // // 'start' property FALSE => the target pH (larger circle)
    // this.svg
    //   .selectAll(".ph-target-to-statement")
    //   .data(phEntryData)
    //   .transition()
    //   .duration(750)
    //   .attr("opacity", 1) // !d.start => target pH
    //   .attr("stroke", "green") // !d.start => target pH
    //   .attr("x2", (d) => xScale(d.hplus))
    //   .attr("y2", (d) => yScale(d.ph));

    // // PH Y-AXIS ARROW
    // // this.svg
    // //   .selectAll(".ph-yaxis-arrow")
    // //   .data(phEntryData)
    // //   .transition()
    // //   .duration(750)
    // //   .attr("stroke", (d) => (d.start ? d.color : ""))
    // //   .attr("y1", yScale(phEntryData[0].ph))
    // //   .attr("y2", yScale(phEntryData[1].ph));

    // // PH INPUT LINES
    this.svg
      .selectAll(".sal-line-to-x")
      .data(salEntryData)
      .transition()
      .duration(750)
      .attr("x1", (d) => xScale(d.sal))
      .attr("y1", (d) => yScale(d.is))
      .attr("x2", (d) => xScale(d.sal))
      .attr("y2", 550)
      .attr("stroke", (d) => d.color)
      .attr("stroke-opacity", 0.35);

    this.svg
      .selectAll(".sal-line-to-y")
      .data(salEntryData)
      .transition()
      .duration(750)
      .attr("x1", (d) => xScale(d.sal))
      .attr("y1", (d) => yScale(d.is))
      .attr("x2", -25)
      .attr("y2", (d) => yScale(d.is));

    // this.svg.selectAll(".result-rect").attr("stroke", "green");

    // // RESULT TEXT
    // this.svg
    //   .selectAll(".ph-change-label")
    //   .transition()
    //   .duration(500)
    //   .text(`  pH: ${round(ph_1, 2)} pH units`)
    //   .attr("fill", "green");

    // this.svg
    //   .selectAll(".hplus-change-label")
    //   .transition()
    //   .duration(500)
    //   // .text(`Δ [H${superPlus}]: ${real_hPlus_1.toFixed(12)} mol/L`)
    //   .text(`  [H${superPlus}]: ${phEntryData[0].hplus.toFixed(12)} mol/L`)
    //   .attr("fill", "green");

    // ******************* //
    // ** END OF UPDATE ** //
    // ******************* //
  }
}

module.exports = IonicStrength;