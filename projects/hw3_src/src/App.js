import React, { Component } from 'react';

import '../node_modules/react-vis/dist/style.css';
import 'semantic-ui-css/semantic.min.css';

import { Segment, Container, Menu, Button, Popup } from 'semantic-ui-react';

import ForceLayout from './components/force_layout';
import Barchart from './components/barchart';

const insights = (
  <div style={{textAlign: "justify"}}>
    <p>Cupcake ipsum dolor sit amet. Dessert sesame snaps topping tiramisu dragée pudding. I love jelly powder I love I love sweet roll sesame snaps.</p>
    <p>Carrot cake liquorice I love pie I love. Candy gingerbread carrot cake croissant cake gummi bears icing biscuit wafer. Apple pie gummi bears gingerbread sweet pudding caramels I love.</p>
    <p>Fruitcake cake candy canes. Tart gummi bears biscuit bear claw jelly-o soufflé soufflé apple pie. Tiramisu liquorice candy canes fruitcake. Ice cream soufflé sweet I love jelly oat cake.</p>
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
    fetch("https://christianpoveda.github.io/visual_analytics/projects/hw3/data/graph.json")
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
            <Menu.Item header>HW3 by Christian Poveda</Menu.Item>
            <Menu.Menu position='right'>
              <Popup inverted content={insights} style={{opacity: 0.7}}trigger={<Menu.Item>Insights</Menu.Item>}/>
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
