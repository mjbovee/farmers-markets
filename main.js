var width = document.querySelector('.content').offsetWidth
var height = document.querySelector('.content').offsetHeight

// var tip = d3.tip()
//     .attr('class', 'd3-tip')
//     .offset([-10, 0])
//     .html(function(d) {
//         return ''
//     })

var color = d3.scaleLinear()
    .domain([0, 1])
    .range(['#9bf4cd', '#1f5569'])

var projection = d3.geoAlbersUsa()
    .translate([width / 2, height / 2])


var path = d3.geoPath()
    .projection(projection)

var svg = d3.select('.content').append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('class', 'map')

// svg.call(tip)

queue()
    .defer(d3.json, 'counties.json')
    .defer(d3.tsv, 'marketData.csv')
    .await(ready)

function ready(error, data, farmersMarkets) {
    var farmersMarketsById = {}

    farmersMarkets.forEach(function(d) {
        farmersMarketsById[d.GEOID] = +d.FMRKTPTH16
    })
    data.features.forEach(function(d) {
        d.farmersMarkets = farmersMarketsById[d.properties.GEOID]
    })

    svg.append('g')
        .attr('class', 'counties')
        .selectAll('path')
        .data(data.features)
        .enter().append('path')
        .attr('d', path)
        .style('fill', function(d) {
            return color(d.farmersMarkets)
        })

    svg.append('path')
        .datum(topojson.mesh(data.features, function(a, b) {
            return a.GEOID !== b.GEOID
        }))
        .attr('class', 'names')
        .attr('d', path)
}

