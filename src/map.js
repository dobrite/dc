var Voronoi = require('voronoi'),
    _ = require('lodash'),
    perlin = require('../vendor/perlin'),
    config = require('./config');

var voronoi = new Voronoi();

var bbox = {
  xl: 0,
  xr: config.WORLD_WIDTH,
  yt: 0,
  yb: config.WORLD_HEIGHT,
};

var sites = _.range(0, config.MAX_NODES).map(() => {
  return {
    x: _.random(config.WORLD_WIDTH),
    y: _.random(config.WORLD_HEIGHT)
  };
});

var isEdge = function (he) {
  return he.edge.va.x === config.WORLD_WIDTH ||
    he.edge.va.x === 0 ||
    he.edge.va.y === config.WORLD_HEIGHT ||
    he.edge.va.y === 0 ||
    he.edge.vb.x === config.WORLD_WIDTH ||
    he.edge.vb.x === 0 ||
    he.edge.vb.y === config.WORLD_HEIGHT ||
    he.edge.vb.y === 0;
};

var diagram = window.diagram = voronoi.compute(sites, bbox);

diagram.cells.forEach((cell) => {
  cell.ocean = cell.mapEdge = cell.halfedges.filter(isEdge).length !== 0;
});

perlin.seed(Math.random());

diagram.cells.forEach((cell) => {
  // larger the divisor the more zoomed out it is (lots of small lakes)
  cell.ocean = cell.ocean || perlin.simplex2(cell.site.x / 175, cell.site.y / 175) > 0.50;
});

var peakPercent = _.random(1, 100);
var numPeaks = _.find(config.PEAK_DISTRIBUTION, (k, v) => peakPercent < parseInt(v, 10));

_.range(0, numPeaks).map(() => {
  diagram.cells[_.random(0, diagram.cells.length - 1)].elevation = 100;
});

module.exports = diagram;
