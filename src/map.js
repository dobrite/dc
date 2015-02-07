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

var diagram = window.diagram = voronoi.compute(sites, bbox);

diagram.cells.forEach((cell) => {
  cell.ocean = cell.mapEdge = cell.halfedges.filter((he) => {
    return he.edge.va.x === config.WORLD_WIDTH ||
      he.edge.va.x === 0 ||
      he.edge.va.y === config.WORLD_HEIGHT ||
      he.edge.va.y === 0 ||
      he.edge.vb.x === config.WORLD_WIDTH ||
      he.edge.vb.x === 0 ||
      he.edge.vb.y === config.WORLD_HEIGHT ||
      he.edge.vb.y === 0;
  }).length !== 0;
});

perlin.seed(Math.random());

diagram.cells.forEach((cell) => {
  cell.ocean = cell.ocean || perlin.simplex2(cell.site.x / 100, cell.site.y / 100) > 0.50;
});

module.exports = diagram;
