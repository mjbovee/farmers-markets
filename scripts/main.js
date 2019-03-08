var width = document.querySelector('.content').offsetWidth
var height = document.querySelector('.content').offsetHeight

var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
        return d.farmersMarkets !== undefined ? '<strong>County: </strong>' + d.properties.NAME + '<br>' +
        '<strong>Farmers\'s Markets per 1,000 residents: </strong>' + d.farmersMarkets.toFixed(4) + '<br>' :
        '<strong>County: </strong>' + d.properties.NAME + '<br>' +
        '<strong>Farmers\'s Markets per 1,000 residents: </strong> No data'
    })

var color = d3.scaleLinear()
    .domain([0, 0.5])
    .range(['#d3c5ff', '#58508d'])

var projection = d3.geoAlbersUsa()
    .translate([width / 2, height / 2.25])
    .scale(1600)


var path = d3.geoPath()
    .projection(projection)

var svg = d3.select('.content').append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('class', 'map')

svg.call(tip)

queue()
    .defer(d3.json, 'data/counties.json')
    .defer(d3.tsv, 'data/marketData.csv')
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
            return d.farmersMarkets !== undefined ? color(d.farmersMarkets) : '#e0e0e0'
        })
        .style('stroke', '#eee')
        .style('stroke-width', 0.75)
        .style('opacity', 0.7)

        // tooltips
            .style('stroke', '#eee')
            .style('stroke-width', 0.25)
            .on('mouseover', function(d) {
                tip.show(d)

                d3.select(this)
                    .style('opacity', 1)
                    .style('stroke', '#eee')
                    .style('stroke-width', 2)
            })
            .on('mouseout', function(d) {
                tip.hide(d)

                d3.select(this)
                    .style('opacity', 0.7)
                    .style('stroke', '#eee')
                    .style('stroke-width', 0.25)
            })


    svg.append('path')
        .datum(topojson.mesh(data.features, function(a, b) {
            return a.GEOID !== b.GEOID
        }))
        .attr('class', 'names')
        .attr('d', path)
}

