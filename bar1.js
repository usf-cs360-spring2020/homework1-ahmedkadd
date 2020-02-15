/* This bar chart code is based on Sophie Engle's Letter Count Bar Chart code which can be found at https://gist.github.com/sjengle/01c24c71016a97938beae8c778c15911 */

let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September"];
let dataset = d3.csv("data1.csv");
dataset.then(function(data) {
    data.map(function(d) {
            d.count = +d.count;
            return d;});
});

dataset.then(draw);

function draw(data) {
  let svg = d3.select("svg#bar");

  let passengerMin = 0;
  let passengerMax = 5742437;

  const width = 960;
  const height = 500;

  svg.attr("width", width);
  svg.attr("height", height);

  let margin = {
    top:    15,
    right:  35,
    bottom: 30,
    left:   10
  };

  let bounds = svg.node().getBoundingClientRect();
  console.log("bounds.height", bounds.height);
  console.log("bounds.width", bounds.width);
  let plotWidth = bounds.width - margin.right - margin.left;
  let plotHeight = bounds.height - margin.top - margin.bottom;


  let passengerScale = d3.scaleLinear()
     .domain([passengerMin, passengerMax])
     .range([plotHeight, 0])
     .nice();

  let monthScale = d3.scaleBand()
     .domain(months)
     .rangeRound([0, plotWidth])
     .paddingInner(0.1);

  let plot = svg.append("g").attr("id", "plot");

  plot.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  console.assert(svg.size() == 1);

  let xAxis = d3.axisBottom(monthScale);
  let yAxis = d3.axisRight(passengerScale);

  let xGroup = plot.append("g").attr("id", "x-axis");
  xGroup.call(xAxis);

  xGroup.attr("transform", "translate(0," + plotHeight + ")");

  let yGroup = plot.append("g").attr("id", "y-axis");
  yGroup.call(yAxis);
  yGroup.attr("transform", "translate(" + plotWidth + ",0)");


  console.log("data:", data);

  let count = new Map(data.map(i => [i.month, i.count]));
  console.log("count:", count);

  let pairs = Array.from(count.entries());
  console.log("pairs:", pairs);

  let bars = plot.selectAll("rect")
    .data(pairs, function(d) { return d[0]; });

  bars.enter().append("rect")
    .attr("class", "bar")
    .attr("width", monthScale.bandwidth())
    .attr("x", d => monthScale(d[0]))
    .attr("y", d => passengerScale(d[1]))
    // here it gets weird again, how do we set the bar height?
    .attr("height", d => plotHeight - passengerScale(d[1]))
    .each(function(d, i, nodes) {
      console.log("Added bar for:", d[0]);
    });

};
