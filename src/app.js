'use strict';

var React = require('react/addons');
var Voronoi = require('voronoi');
var _ = window._ = require('lodash');

var GameMap = require('./GameMap');

var voronoi = new Voronoi();
var bbox = { xl: 0, xr: 800, yt: 0, yb: 800 };
var sites = _.range(0, 1000).map(function () {
  return { x: _.random(800), y: _.random(800) };
});

var diagram = window.diagram = voronoi.compute(sites, bbox);

React.render(
  <GameMap diagram={diagram} />,
  document.getElementById('game')
);
