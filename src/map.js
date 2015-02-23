var Voronoi = require('voronoi'),
    _ = require('lodash'),
    perlin = require('../vendor/perlin'),
    config = require('./config');

// Vertex
    // x
    // y
// Edge
  // lSite
  // rSite
  // va
    // x
    // y
  // vb
    // x
    // y
// Cell
  // site
  // halfedges
// Halfedge
  // site
  // edge
  // getStartpoint()
  // getEndpoint()

// Center.neighbors
// Center.borders
// Center.corners
// Edge.d0 center to center
// Edge.d1
// Edge.v0 corner to corner
// Edge.v1
// Corner.touches
// Corner.protrudes
// Corner.adjacent

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

// Centers

diagram.centers = diagram.cells;
diagram.centers.forEach((center) => {
  var neighbors = center.halfedges.filter((he) => {
    return he.edge.rSite !== null;
  });
  center.borders = center.halfedges;
  var corners = center.halfedges.map((he) => {
    return [he.getStartpoint(), he.getEndpoint()];
  });
  center.corners = _.uniq(_.flatten(corners));
  // one or more null
  center.ocean = center.mapEdge = neighbors.length !== center.halfedges.length;
  center.neighbors = neighbors.map((center) => {
    return diagram.centers[center.edge.rSite.voronoiId];
  });
});

// Corners

diagram.corners = _.uniq(_.flatten(diagram.centers.map((center) => {
  return center.corners;
})));
diagram.corners.forEach((corner) => {
  corner.touches = diagram.centers.filter((center) => {
    return _.indexOf(center.corners, corner) >= 0;
  });
});

perlin.seed(Math.random());

diagram.centers.forEach((center) => {
  // larger the divisor the more zoomed out it is (lots of small lakes)
  center.ocean = center.ocean || perlin.simplex2(center.site.x / 175, center.site.y / 175) > 0.50;
});

var peakPercent = _.random(1, 100);
var numPeaks = _.find(config.PEAK_DISTRIBUTION, (k, v) => peakPercent <= parseInt(v, 10));

_.range(0, numPeaks).map(() => {
  diagram.cells[_.random(0, diagram.cells.length - 1)].elevation = 100;
});

module.exports = diagram;
