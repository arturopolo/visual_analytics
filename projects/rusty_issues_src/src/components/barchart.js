import { FlexibleXYPlot, XAxis, YAxis, VerticalBarSeries } from 'react-vis';
import React from 'react';

const Barchart = ({ data, onBarClick }) => {
  return (
    <div style={{width: "100%", height: "100%"}}>
      <h4 style={{width: "100%", height: "10px"}}>Label Co-ocurrence</h4>
      <div style={{width: "100%", height: "calc(100% - 10px)"}}>
        <FlexibleXYPlot yDomain={[0.5, 2000]} yType="log">
          <XAxis title="Co-occurrence"/>
          <YAxis title="Number of links" tickFormat={Math.round} tickValues={[1, 10, 100, 1000]}/>
          <VerticalBarSeries data={data} onValueClick={onBarClick}/>
        </FlexibleXYPlot>
      </div>
    </div>
  );
};

export default Barchart;
