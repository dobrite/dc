var React = require('react/addons'),
    ReactART = require('react-art'),
    _ = require('lodash'),
    cL = require('./utils').colorLuminance,
    config = require('./config'),
    Group = ReactART.Group,
    Shape = ReactART.Shape,
    Surface = ReactART.Surface,
    Transform = ReactART.Transform;

var MapNode = React.createClass({
  getInitialState: function () {
    return {
      fillColor: this.getFill()
    };
  },

  handleClick: function (e) {
    this.props.setOffset({
      x: e.x,
      y: e.y
    });
  },

  handleMouseOver: function () {
    this.setState({
      fillColor: "#FFFFFF"
    });
  },

  handleMouseOut: function () {
    this.setState({
      fillColor: this.getFill()
    });
  },

  getFill: function () {
    if (this.props.cell.elevation === 100) {
      return "#CCCCCC";
    }

    var color = (this.props.cell.ocean) ?  '#0000FF' : '#00AA00';
    var r = _.random(0.0, 0.05, true) - 0.025;
    return cL(color, r);
  },

  getStroke: function () {
    if (this.props.cell.elevation === 100) {
      return "#AAAAAA";
    }

    return (this.props.cell.ocean) ? '#0000CC' : '#009900';
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
          stroke={this.getStroke()}
          strokeWidth={1}
          fill={this.state.fillColor}
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
