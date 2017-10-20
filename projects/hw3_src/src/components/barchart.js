import {XYPlot, XAxis, YAxis, VerticalBarSeries} from 'react-vis';
import React from 'react';

const Barchart = ({ data, onBarClick }) => {
  return (
    <div>
      <XYPlot width={1024} height={200} yDomain={[0.5, 2000]} yType="log">
        <XAxis />
        <YAxis tickFormat={Math.round} tickValues={[1, 10, 100, 1000]}/>
        <VerticalBarSeries data={data} onValueClick={onBarClick}/>
      </XYPlot>
    </div>
  );
};

export default Barchart;
