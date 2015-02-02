'use strict';

var React = require('react/addons');
var GameMap = require('./GameMap');
var map = require('./map');

React.render(
  <GameMap map={map} />,
  document.getElementById('game')
);
