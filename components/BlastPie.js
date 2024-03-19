import React, { useEffect, useState } from 'react'

import { Container, Row, Col, Spinner, Alert} from 'react-bootstrap';
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell, Legend } from 'recharts';


//rechart modifications
const COLORS = ['#413ea0', '#8884d8', '#FFBB28', '#FF8042'];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
    };

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`Date : ${label}`}</p>
          
        </div>
      );
    }
    return null;
  };

function blastPie(props) {
    const [assets,setAssets] = useState(null);


    

    useEffect(()=>{
        if(props.ethTotal){
            const data = [{name:"Eth Total", value:0}, {name:"Stables Total", value:0}];
            data[0].value = props.ethTotal[0]
            data[1].value = props.usdTotal[0]
            setAssets(data)
        }
    },[props])

  return (
    <Container fluid>
        <Row>
            <Col className='text-start'>
                <h4>Portfolio Composition: ETH vs. USD</h4>
                <p>A lowdown on how your stash is split between Ethereum and stables, all based on ETH's latest price action</p>
                
            </Col>
        </Row>
        <Row>
            <Col>
                {props.loading ? (
                    <Spinner animation="grow" className='ms-1'/> 
                ):(
                    assets ? (
                        <ResponsiveContainer width='100%' aspect={4.0/3.0}>
                            <PieChart>
                                <Pie
                                    dataKey="value"
                                    isAnimationActive={true}
                                    data={assets}
                                    cx="50%"
                                    cy="50%"
                                    fill="#8884d8"
                                    label={renderCustomizedLabel}
                                    labelLine={false}
                                >
                                    {assets.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                    ))}
                                </Pie>
                                <Tooltip/>
                                <Legend />

                            </PieChart>
                        </ResponsiveContainer>
                    ):<Alert  variant='primary description'>
                    Introduce your address to display your blast insights.
            </Alert>
                )}
            </Col>
        </Row>
    </Container>
  )
}

export default blastPie