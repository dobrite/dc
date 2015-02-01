var React = require('react/addons');
var ReactART = require('react-art');
var _ = require('lodash');

var Group = ReactART.Group;
var Shape = ReactART.Shape;
var Surface = ReactART.Surface;


var MapNode = React.createClass({
  getInitialState: function () {
    return { fillColor: "#AAAAAA" };
  },

  handleClick: function () {
    var cell = this.props.cell;
    console.log(`${cell.site.x},${cell.site.y}`);
  },

  handleMouseOver: function () {
    this.setState({fillColor: "#FFFFFF"});
  },

  handleMouseOut: function () {
    this.setState({fillColor: "#AAAAAA"});
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
        onClick={this.handleClick}
        onMouseOver={this.handleMouseOver}
        onMouseOut={this.handleMouseOut}>
        <Shape
          stroke="#CCCCCC"
          strokeWidth={1}
          fill={this.state.fillColor}
          d={this.getPath()} />
      </Group>
    );
  }
});

var GameMap = React.createClass({
  render: function () {
    return (
      <Surface
        width={800}
        height={800}
        style={{cursor: 'pointer'}}>
        {this.renderMapNodes(this.props.diagram.cells)}
      </Surface>
    );
  },

  renderMapNodes: function (cells) {
    return cells.map(cell =>
      <MapNode
        key={`${cell.site.x},${cell.site.y}`}
        cell={cell} />
    );
  }
});

module.exports = GameMap;
