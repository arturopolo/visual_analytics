var data = [
  {"DEPARTAMENTO": "ANTIOQUIA", "REGION": "ANDINA", "TOTAL": 15608, "POBLACION": 1596543},
  {"DEPARTAMENTO": "ARAUCA", "REGION": "ORINOQUIA", "TOTAL": 250, "POBLACION": 91045},
  {"DEPARTAMENTO": "ATLANTICO", "REGION": "CARIBE", "TOTAL": 2005, "POBLACION": 650355},
  {"DEPARTAMENTO": "BOGOTA", "REGION": "ANDINA", "TOTAL": 39722, "POBLACION": 1845726},
  {"DEPARTAMENTO": "BOLIVAR", "REGION": "CARIBE", "TOTAL": 2503, "POBLACION": 611190},
  {"DEPARTAMENTO": "BOYACA", "REGION": "ANDINA", "TOTAL": 4852, "POBLACION": 352961},
  {"DEPARTAMENTO": "CALDAS", "REGION": "ANDINA", "TOTAL": 1002, "POBLACION": 242811},
  {"DEPARTAMENTO": "CAQUETA", "REGION": "AMAZONIA", "TOTAL": 517, "POBLACION": 153574},
  {"DEPARTAMENTO": "CASANARE", "REGION": "ORINOQUIA", "TOTAL": 200, "POBLACION": 108778},
  {"DEPARTAMENTO": "CAUCA", "REGION": "PACIFICO", "TOTAL": 2681, "POBLACION": 393969},
  {"DEPARTAMENTO": "CESAR", "REGION": "CARIBE", "TOTAL": 11876, "POBLACION": 323320},
  {"DEPARTAMENTO": "CHOCO", "REGION": "PACIFICO", "TOTAL": 589, "POBLACION": 178183},
  {"DEPARTAMENTO": "CORDOBA", "REGION": "CARIBE", "TOTAL": 8745, "POBLACION": 508715},
  {"DEPARTAMENTO": "CUNDINAMARCA", "REGION": "ANDINA", "TOTAL": 12137, "POBLACION": 720775},
  {"DEPARTAMENTO": "HUILA", "REGION": "ANDINA", "TOTAL": 816, "POBLACION": 336435},
  {"DEPARTAMENTO": "LA GUAJIRA", "REGION": "CARIBE", "TOTAL": 1306, "POBLACION": 313312},
  {"DEPARTAMENTO": "MAGDALENA", "REGION": "CARIBE", "TOTAL": 2534, "POBLACION": 408091},
  {"DEPARTAMENTO": "META", "REGION": "ORINOQUIA", "TOTAL": 2773, "POBLACION": 269428},
  {"DEPARTAMENTO": "NARIÑO", "REGION": "PACIFICO", "TOTAL": 4624, "POBLACION": 494354},
  {"DEPARTAMENTO": "NORTE DE SANTANDER", "REGION": "ANDINA", "TOTAL": 4721, "POBLACION": 199862},
  {"DEPARTAMENTO": "PUTUMAYO", "REGION": "AMAZONIA", "TOTAL": 843, "POBLACION": 114276},
  {"DEPARTAMENTO": "QUINDIO", "REGION": "ANDINA", "TOTAL": 1462, "POBLACION": 137956},
  {"DEPARTAMENTO": "RISARALDA", "REGION": "ANDINA", "TOTAL": 380, "POBLACION": 232355},
  {"DEPARTAMENTO": "SAN ANDRES Y PROVIDENCIA", "REGION": "CARIBE", "TOTAL": 0, "POBLACION": 19258},
  {"DEPARTAMENTO": "SANTANDER", "REGION": "ANDINA", "TOTAL": 4893, "POBLACION": 517747},
  {"DEPARTAMENTO": "SUCRE", "REGION": "CARIBE", "TOTAL": 11965, "POBLACION": 250394},
  {"DEPARTAMENTO": "TOLIMA", "REGION": "ANDINA", "TOTAL": 1474, "POBLACION": 387616},
  {"DEPARTAMENTO": "VALLE DEL CAUCA", "REGION": "PACIFICO", "TOTAL": 11969, "POBLACION": 1110117},
  {"DEPARTAMENTO": "GRUPO AMAZONIA", "REGION": "AMAZONIA", "TOTAL": 806, "POBLACION": 122889}
];

var regionColors = {
  "ANDINA": "#ff7f00",
  "PACIFICO": "#984ea3",
  "CARIBE": "#377eb8",
  "AMAZONIA": "#4daf4a",
  "ORINOQUIA": "#e41a1c",
}

function get_percent(d) {
  return 100 * d["TOTAL"] / d["POBLACION"];
}

data = data.sort(function(a, b) {
  return get_percent(a) > get_percent(b);
});

var margin = {top: 20, right: 20, bottom: 100, left: 170};
var width = 650 - margin.left - margin.right;
var height = 570 - margin.top - margin.bottom;

var yRange = [];
for (i = 0; i <= data.length; i++) {
  yRange.push(i * height / data.length);
}

var y = d3.scaleOrdinal()
  .range(yRange)
  .domain(data.map(function(d) { return d["DEPARTAMENTO"]; }));

var x = d3.scaleLinear()
  .range([0, height])
  .domain([0, d3.max(data, get_percent)]);

var svg = d3.select("#chart").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var div = d3.select("#chart").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

svg.selectAll(".bar")
  .data(data)
  .enter().append("rect")
  .attr("class", "bar")
  .attr("x", function(d) { return 0; })
  .attr("height", 14)
  .attr("y", function(d) { return y(d["DEPARTAMENTO"]) - 7; })
  .attr("width", function(d) { return x(get_percent(d)); })
  .style("fill", function(d) { return regionColors[d["REGION"]]; })
  .on("mouseover", function(d) {
    div.transition()
      .duration(200)
      .style("opacity", .9);
    div.html("<div>Región: <span style=\"color:" + regionColors[d["REGION"]] + "\">" + d["REGION"] + "</span></div><div>Total niños: " + d["POBLACION"]+ "</div><div>Total computadores: " + d["TOTAL"] + "</div>")
      .style("left", (d3.event.pageX) + "px")
      .style("top", (d3.event.pageY - 28) + "px");
  })
  .on("mouseout", function(d) {
    div.transition()
      .duration(500)
      .style("opacity", 0);
  });
svg.append("g")
  .call(d3.axisBottom(x))
  .attr("transform", "translate(0," + height + ")");

svg.append("text")             
      .attr("transform",
            "translate(" + (0.5 * (width  - margin.left - margin.right)) + " ," + (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("Computadores por cada 100 niños");

svg.append("text")
      .attr("transform", "translate(500, 0)")

svg.append("g")
  .call(d3.axisLeft(y));
