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

// DAVIES EQUATION ZONE
const daviesEqnData = {
  sal: 24.48,
  is: (19.924 * 24.48) / (1000.0 - 1.005 * 24.48),
  color: "green",
  start: "n/a",
};

// ** TRUESDELL-JONES S < 47.78059152372307 ppt
// console.log(`SAL = ${1000 / (19.924 + 1.005)}`);
// console.log(
//   ` IS = ${(19.924 * 47.78059152372307) / (1000.0 - 1.005 * 47.78059152372307)}`
// );

// TRUESDELL-JONES EQUATION ZONE
const truesdell_jonesEqnData = {
  sal: 40.0, // [NB] Set to max of this x-axis, not T-J sal max
  // sal: 47.78059152372307,
  is: (19.924 * 47.78059152372307) / (1000.0 - 1.005 * 47.78059152372307),
  color: "green",
  start: "n/a",
};

// STANDARD SW LINE
const seawaterData = {
  sal: 34.5, // [NB] Set to max of this x-axis, not T-J sal max
  // sal: 47.78059152372307,
  is: (19.924 * 34.5) / (1000.0 - 1.005 * 34.5),
  color: "red",
  start: "n/a",
};

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
      .attr("viewBox", `-230 0 1280 650`) // [HACK] MODIFIED to display ~properly in Firefox
      // .attr("viewBox", `0 0 600 650`)
      .style("width", "590")
      .style("height", "400");

    // ACCESSORS
    const xAccessor = (d) => d.sal;
    const yAccessor = (d) => d.is;

    // SCALES
    let xScale = d3.scaleLinear().domain([0, 40]).range([0, 750]);

    let yScale = d3.scaleLinear().domain([0, 1]).range([550, 100]);

    // TITLE
    svg
      .selectAll(".text-label")
      .data(salEntryData)
      .enter()
      .append("text")
      .attr("class", "title-label")
      .attr("x", size / 2 + 100)
      .attr("y", 55)
      .style("font-size", "2.1rem")
      .attr("fontWeight", 500)
      .text(
        `Ionic Strength = ${round(
          (19.924 * sal) / (1000.0 - 1.005 * sal),
          4
        )} mol/kg`
      )
      .attr("text-anchor", "middle")
      .attr("fill", (d) => (d.is <= 0.5 ? "blue" : "#FF4023"))
      .attr("stroke", (d) => (d.is <= 0.5 ? "blue" : "#FF4023"));
    // .attr("fill", "blue");

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

    // TRUESDELL-JONES EQN ZONE UNDERLAY & TITLE
    svg
      .append("rect")
      .attr("class", "tdj-rect")
      .attr("x", 0)
      .attr("y", yScale(truesdell_jonesEqnData.is))
      .attr("width", xScale(truesdell_jonesEqnData.sal))
      .attr("height", 550 - yScale(truesdell_jonesEqnData.is))
      .attr("stroke", "darkgray")
      .attr("stroke-width", "0.5px")
      .attr("fill", "orange")
      .attr("opacity", 0.15);

    svg
      .append("text")
      .attr("class", "tdj-label")
      .attr("x", xScale(0.5))
      .attr("text-anchor", "start")
      .attr("y", yScale(0.93))
      .style("font-size", "1.70rem")
      .text(`Truesdell-Jones Equation Validity Zone`)
      .attr("fill", "brown");

    // DAVIES EQN ZONE UNDERLAY & TITLE
    svg
      .append("rect")
      .attr("class", "davies-rect")
      .attr("x", 0)
      .attr("y", yScale(daviesEqnData.is))
      .attr("width", xScale(daviesEqnData.sal))
      .attr("height", 550 - yScale(daviesEqnData.is))
      .attr("stroke", "blue")
      .attr("stroke-width", "0.5px")
      .attr("fill", "#E8F4F8");

    svg
      .append("text")
      .attr("class", "davies-label")
      .attr("x", xScale(0.5))
      .attr("text-anchor", "start")
      // .attr("x", xScale(daviesEqnData.sal) / 2)
      // .attr("text-anchor", "middle")
      .attr("y", yScale(0.43))
      // .attr("y", yScale(daviesEqnData.is))
      .style("font-size", "1.70rem")
      .text(`Davies Equation Validity Zone`)
      .attr("fill", "blue");

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
      .attr("stroke", "darkgray")
      // .attr("stroke", "url(#linear-gradient)")
      .attr("stroke-width", 4);

    // ********************** //
    // ****** SW INPUT ****** //
    // ********************** //

    svg
      .append("text")
      .attr("class", "sw-label")
      .attr("x", xScale(11.0))
      .attr("text-anchor", "start")
      .attr("y", yScale(seawaterData.is + 0.01))
      .style("font-size", "1.35rem")
      .text(`Standard Seawater`)
      .attr("fill", "green");

    // SW INPUT LINES
    svg
      .append("line")
      .attr("class", "sw-to-x")
      .attr("stroke", "green")
      .style("stroke-dasharray", "3, 3")
      // .attr("stroke-opacity", 0.35)
      .style("stroke-width", 2)
      .attr("x1", xScale(seawaterData.sal))
      .attr("y1", yScale(seawaterData.is))
      .attr("x2", xScale(seawaterData.sal))
      .attr("y2", 550);

    svg
      .append("line")
      .attr("class", "sw-to-y")
      .attr("stroke", "green")
      .style("stroke-dasharray", "3, 3")
      // .attr("stroke-opacity", 0.35)
      .style("stroke-width", 2)
      .attr("x1", xScale(seawaterData.sal))
      .attr("y1", yScale(seawaterData.is))
      .attr("x2", -25)
      .attr("y2", yScale(seawaterData.is));

    // ********************** //
    // ****** SAL INPUT ***** //
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
      .attr("stroke", (d) => (d.is <= 0.5 ? "blue" : "#FF4023"))
      // .attr("stroke-opacity", 0.85)
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
      .attr("stroke", (d) => (d.is <= 0.5 ? "blue" : "#FF4023"))
      // .attr("stroke-opacity", 0.85)
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

    // SW LINE CIRCLE
    // svg
    //   .append("circle")
    //   .attr("class", "sw-circle")
    //   .attr("cx", xScale(seawaterData.sal))
    //   .attr("cy", yScale(seawaterData.is))
    //   .attr("r", 10)
    //   .attr("opacity", 0.35)
    //   .attr("fill", "green");

    // SALINITY LINE CIRCLES
    let circles = svg
      .selectAll("circle")
      .data(salEntryData)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(xAccessor(d)))
      .attr("cy", (d) => yScale(yAccessor(d)))
      .attr("r", 13)
      .attr("fill", (d) => (d.is <= 0.5 ? "blue" : "#FF4023"));
    // .attr("fill", "red"); // "#E8F4F8"
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
      .attr("fill", (d) => (d.is <= 0.5 ? "blue" : "#FF4023"));
    // .attr("fill", (d) => d.color);

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
      .attr("fill", (d) => (d.is <= 0.5 ? "blue" : "#FF4023"));
    // .attr("fill", (d) => d.color);

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
      .attr("fill", (d) => (d.is <= 0.5 ? "blue" : "#FF4023")); // "#E8F4F8"
    // .attr("opacity", 0.45);

    // PH Y-AXIS CIRCLES
    this.svg
      .selectAll(".sal-yaxis-markers")
      .data(salEntryData)
      .transition()
      .duration(750)
      .attr("cy", (d) => yScale(d.is))
      .attr("r", 7.0)
      .attr("fill", (d) => (d.is <= 0.5 ? "blue" : "#FF4023"));

    // PH X-AXIS CIRCLES
    this.svg
      .selectAll(".sal-xaxis-markers")
      .data(salEntryData)
      .transition()
      .duration(750)
      .attr("cx", (d) => xScale(d.sal))
      .attr("r", 7.0)
      .attr("fill", (d) => (d.is <= 0.5 ? "blue" : "#FF4023"));

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

    // IONIC STRENGTH TITLE LABEL
    this.svg
      .selectAll(".title-label")
      .data(salEntryData)
      .transition()
      .duration(750)
      .attr("fill", (d) => (d.is <= 0.5 ? "blue" : "#FF4023"))
      .attr("stroke", (d) => (d.is <= 0.5 ? "blue" : "#FF4023"))
      .text(
        `Ionic Strength = ${round(
          (19.924 * sal) / (1000.0 - 1.005 * sal),
          4
        ).toFixed(4)} mol/kg`
      );

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
      .attr("stroke", (d) => (d.is <= 0.5 ? "blue" : "#FF4023"))
      .attr("stroke-opacity", 0.35);

    this.svg
      .selectAll(".sal-line-to-y")
      .data(salEntryData)
      .transition()
      .duration(750)
      .attr("x1", (d) => xScale(d.sal))
      .attr("y1", (d) => yScale(d.is))
      .attr("x2", -25)
      .attr("y2", (d) => yScale(d.is))
      .attr("stroke", (d) => (d.is <= 0.5 ? "blue" : "#FF4023"))
      .attr("stroke-opacity", 0.35);

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
