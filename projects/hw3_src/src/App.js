import React, { Component } from 'react';
import '../node_modules/react-vis/dist/style.css';
import ForceLayout from './components/force_layout';
import Barchart from './components/barchart';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      graph: {
        nodes: [],
        links: []
      },
      visibleGraph: {
        nodes: [],
        links: []
      },
      freqs: [],
      threshold: 50
    };
    this.getGraph();
  }

  getGraph() {
    fetch("https://christianpoveda.github.io/visual_analytics/projects/hw3/data/graph.json")
      .then((response) => response.json())
      .then(this.handleGraph.bind(this));
  }

  handleGraph(graph) {
    let freqs = new Map()
    graph.links.forEach(({ value }) => {
      value = 10*Math.floor( value / 10 );
      if (freqs.has(value)) {
        freqs.set(value, freqs.get(value) + 1);
      } else {
        freqs.set(value, 1);
      }
    });
    this.setState({
      graph: graph,
      freqs: Array.from(freqs).map(([value, count]) => ({x: value, y: count}))}
    );
    this.onBarClick({x: 50});
  }

  onBarClick(point) {
    this.setState({ threshold: point.x });
    let freqs = this.state.freqs.map((other) => {
      if (other.x < point.x) {
        other.opacity = 0.1;  
      } else if (other.x === point.x) {
        other.opacity = 0.5;  
      } else if (other.x > point.x) {
        other.opacity = 1.0;
      }
      return other;
    });

    let links = this.state.graph.links.filter(({ value }) => value >= point.x);
    let ids = new Set();
    
    links.forEach(({ source, target }) => {
      ids.add(source);
      ids.add(target);
    });
    
    let nodes = this.state.graph.nodes.filter(({ id }) => ids.has(id));

    this.setState({
      freqs: freqs,
      visibleGraph: {
        links: links,
        nodes: nodes
      }
    });
  }

  render() {
    return (
      <div className="App">
        <ForceLayout data={this.state.visibleGraph} />
        <Barchart data={this.state.freqs} onBarClick={this.onBarClick.bind(this)} />
      </div>
    );
  }
}

export default App;
