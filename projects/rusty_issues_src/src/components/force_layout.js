import React from 'react';
import { InteractiveForceGraph, ForceGraphNode, ForceGraphLink } from 'react-vis-force';

const colors = {
  "A": "#DCE527",
  "B": "#E527DD",
  "C": "#F6F3FD",
  "E": "#27E530",
  "I": "#E53027",
  "O": "#9191D0",
  "P": "#ED7B41",
  "S": "#D9E2E2",
  "T": "#C8DAF3",
  "WG": "#CBE4CE",
  "None": "purple"
}

const ForceLayout = ({ data }) => {
  let nodes = data.nodes.map(({id, group}) => <ForceGraphNode key={id} node={{id: id, label: id, radius: 5}} fill={colors[group]}/>);
  let links = data.links.map(({source, target, value}) => <ForceGraphLink opacity={0.15} key={`${source}-${target}`} link={{source: source, target: target, value: Math.sqrt(value)/2}}/>);
  return (
    <div style={{ width: "100%", height: "100%"}}>
      <h4 style={{width: "100%", height: "10px"}}>Relation between labels</h4>
      <div style={{ width: "100%", height: "calc(100% - 10px)", transform: "translate(calc(50% - 150px), calc(50% - 150px))" }}>
        <InteractiveForceGraph
          simulationOptions={{
            height: 300,
            width: 300,
            animate: true,
            alpha: 0.8
          }}
          highlightDependencies
          labelAttr="label">
          { nodes }
          { links }
        </InteractiveForceGraph>
      </div>
    </div>
  );
};

export default ForceLayout;
