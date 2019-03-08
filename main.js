var width = document.querySelector('.content').offsetWidth
var height = document.querySelector('.content').offsetHeight

var div = d3.select('.content').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 0)

var svg = d3.select('.content').append('svg')
    .attr('width', width)
    .attr('height', height)

var projection = d3.geoMercator()
    .translate([width / 2, height / 2])

var path = d3.geoPath()
    .projection(projection)

svg.call(tip)