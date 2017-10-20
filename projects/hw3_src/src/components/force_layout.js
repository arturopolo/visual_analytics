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
  let links = data.links.map(({source, target, value}) => <ForceGraphLink key={`${source}-${target}`} link={{source: source, target: target, value: Math.sqrt(value)/2}}/>);
  return (
    <div>
      <InteractiveForceGraph
        simulationOptions={{
          height: 400,
          width: 1024,
          animate: true,
          alpha: 0.8
        }}
        highlightDependencies
        labelAttr="label">
        { nodes }
        { links }
      </InteractiveForceGraph>
    </div>
  );
};

export default ForceLayout;
