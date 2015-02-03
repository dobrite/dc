var React = require('react/addons');
var ReactART = require('react-art');
var _ = require('lodash');

var config = require('./config');

var Group = ReactART.Group;
var Shape = ReactART.Shape;
var Surface = ReactART.Surface;
var Transform = ReactART.Transform;

var MapNode = React.createClass({
  getInitialState: function () {
    return { fillColor: "#AAAAAA" };
  },

  handleClick: function (e) {
    this.props.setOffset({
      x: e.x,
      y: e.y
    });
    console.log(this.props.cell);
  },

  handleMouseOver: function () {
    this.setState({fillColor: "#FFFFFF"});
  },

  handleMouseOut: function () {
    this.setState({fillColor: "#AAAAAA"});
  },

  getStroke: function () {
    return (this.props.cell.ocean) ? 'blue' : 'green';
  },

  getPath: function () {
    if (typeof this.path === 'undefined') {
      this.path = "M" + this.props.cell.halfedges.map(function (he) {
        return `${he.getStartpoint().x},${he.getStartpoint().y} ${he.getEndpoint().x},${he.getEndpoint().y}`;
      }).join(" ");
    }

    return this.path;
  },

  render: function () {
    return (
      <Group
        transform={new Transform().move(-this.props.offsetX, -this.props.offsetY)}
        onClick={this.handleClick}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}
      >
        <Shape
          stroke="#CCCCCC"
          strokeWidth={1}
          fill={this.getStroke()}
          d={this.getPath()}
        />
      </Group>
    );
  }
});

var GameMap = React.createClass({
  getInitialState: function () {
    return { x: 0, y: 0 };
  },

  setOffset: function ({ x, y }) {
    this.setState({ x, y });
  },

  render: function () {
    return (
      <Surface
        width={config.VIEWPORT_WIDTH}
        height={config.VIEWPORT_HEIGHT}
        style={{cursor: 'pointer'}}
      >
        {this.renderMapNodes(this.props.map.cells, this.state)}
      </Surface>
    );
  },

  renderMapNodes: function (cells, {x, y}) {
    return cells.map(cell => {
      return (
        <MapNode
          setOffset={this.setOffset}
          offsetX={x}
          offsetY={y}
          key={`${cell.site.x},${cell.site.y}`}
          cell={cell}
        />
      );
    });
  }
});

module.exports = GameMap;
