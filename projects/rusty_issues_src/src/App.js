import React, { Component } from 'react';

import '../node_modules/react-vis/dist/style.css';
import 'semantic-ui-css/semantic.min.css';

import { Segment, Container, Menu, Popup } from 'semantic-ui-react';

import ForceLayout from './components/force_layout';
import Barchart from './components/barchart';

const about = (
  <div style={{textAlign: "justify"}}>
    <p>This is a visualization of the co-ocurrences between labels on the Rust's issue tracker.</p>
    <p>Each node represents one label and each link between nodes represents the number of co-ocurrences between those labels.</p>
    <p>The chart at the bottom of the page its an histogram of the number of co-ocurrences, you can use it to filter the nodes and only display those that have more than a certain number of co-occurrences with other nodes.</p>
  </div>
);
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
    fetch("https://christianpoveda.github.io/visual_analytics/projects/rusty_issues/data/graph.json")
      .then((response) => response.json())
      .then(this.handleGraph.bind(this));
  }

  handleGraph(graph) {
    graph.links = graph.links.filter(({ source, target }) => source !== target);

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
      <div className="App" style={{width: "100%", height: "100vh"}}>
        <Container style={{ height: "100%"}}>
          <Menu inverted>
            <Menu.Item header>Rusty Issues by Christian Poveda</Menu.Item>
            <Menu.Menu position='right'>
              <Popup inverted content={about} style={{opacity: 0.7}}trigger={<Menu.Item>About</Menu.Item>}/>
            </Menu.Menu>
          </Menu>    
          <Segment style={{width: "100%", height: "calc(60% - 40px - 1rem)"}}>
            <ForceLayout data={this.state.visibleGraph} />
          </Segment>
          <Segment style={{width: "100%", height: "calc(40% - 1rem)"}}>
            <Barchart data={this.state.freqs} onBarClick={this.onBarClick.bind(this)} />
          </Segment>
        </Container>
      </div>
    );
  }
}

export default App;
