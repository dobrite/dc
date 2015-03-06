'use strict';

var React   = require('react/addons'),
    _       = require('lodash'),
    GameMap = require('./GameMap'),
    map     = require('./map');

React.render(
  <GameMap map={map} />,
  document.getElementById('game')
);
