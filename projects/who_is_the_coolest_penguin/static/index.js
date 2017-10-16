var width = 700;
var plotSvg = document.getElementById('plotSvg');
plotSvg.setAttribute("width", width);
var height = 550;
plotSvg.setAttribute("height", height);

var parseDate = d3.timeParse("%Y-%m-%d");
var svg = d3.select("#plotSvg"),
  margin = {
    top: 0,
    right: 80,
    bottom: 200,
    left: 20
  },
  width = width - margin.left - margin.right,
  height = height - margin.top - margin.bottom;

svg.selectAll("*").remove();

g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv('data/commits.csv', function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.date = parseDate(d.date);
    d["Arnd Bergmann <arnd@arndb.de>"] = parseFloat(d.author_0);
    d["David S. Miller <davem@davemloft.net>"] = parseFloat(d.author_1);
    d["H Hartley Sweeten <hsweeten@visionengravers.com>"] = parseFloat(d.author_2);
    d["Takashi Iwai <tiwai@suse.de>"] = parseFloat(d.author_3);
    d["Linus Torvalds <torvalds@linux-foundation.org>"] = parseFloat(d.author_4);
    d["Other Authors"] = parseFloat(d.other);
  });

  var keys = ([
    "Other Authors",
    "Linus Torvalds <torvalds@linux-foundation.org>",
    "Takashi Iwai <tiwai@suse.de>",
    "H Hartley Sweeten <hsweeten@visionengravers.com>",
    "David S. Miller <davem@davemloft.net>",
    "Arnd Bergmann <arnd@arndb.de>",
  ]);

  var stack = d3.stack()
    .keys(keys)
    .order(d3.stackOrderNone)
    .offset(d3.stackOffsetWiggle);

  var series = stack(data);

  var x = d3.scaleTime()
    .domain(d3.extent(data, function(d) {
      return d.date;
    }))
    .range([0, width + margin.right]);

  var xAxis = d3.axisBottom(x);

  var y = d3.scaleLinear()
    .domain([0, d3.max(series, function(layer) {
      return d3.max(layer, function(d) {
        return d[0] + d[1];
      });
    })])
    .range([height, 0]);


  var z = d3.scaleOrdinal()
    .range(["#8dd3c7", " #ffffb3", " #bebada", " #fb8072", " #80b1d3", " #fdb462"]);
  
  var area = d3.area()
    .x(function(d) {
      return x(d.data.date);
    })
    .y0(function(d) {
      return y(d[0]);
    })
    .y1(function(d) {
      return y(d[1]);
    })
    .curve(d3.curveBasis);

  g.selectAll("path")
    .data(series)
    .enter().append("path")
    .attr("d", area)
    .style("fill", function() {
      return z(Math.random());
    });

  g.append("g")
    .call(xAxis)
    .attr("transform", "translate(" + 0 + "," + (height + margin.bottom / 2) + ")");

  z.domain(keys);
  var legend = g.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
    .attr("transform", function(d, i) {
      return "translate(0," + i * 20 + ")";
    });

  legend.append("rect")
    .attr("x", width + 55)
    .attr("width", 19)
    .attr("height", 19)
    .attr("fill", z);

  legend.append("text")
    .attr("x", width + 50)
    .attr("y", 9.5)
    .attr("dy", "0.32em")
    .text(function(d) {
      return d;
    });
});
