import React, { useEffect, useState } from 'react'

import { Container, Row, Col, Spinner, Alert} from 'react-bootstrap';

import { CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, ComposedChart, Bar, Area, Rectangle } from 'recharts';

import AlertDismissibleExample from '../components/AlertDismissibleExample';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`Date : ${label}`}</p>
          <p className="desc">{`Eth Deposited : ${payload[1].value}`}</p>
          <p className="desc">{`Eth Accumulated : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

function EthActivity(props) {
    const [arrayEthAct, setArrayEthAct] = useState(null);
    const [pioneer, setPioneer] = useState(false);
    
    useEffect(()=>{
        const tempActivity = []
        setPioneer(false)
        //Normalize daily_activity to rechart format
        if (props.dailyActivity){
            
            Object.entries(props.dailyActivity).forEach(([key, value]) =>{
                tempActivity.push({date:key, ...value})
            });
            setArrayEthAct(tempActivity);
            //pioneer check
            const firtDeposit = Object.keys(props.dailyActivity)[0];
            const date1 = new Date(firtDeposit);
            const date2 = new Date('2023-11-26');
            if (date1 <= date2) {
                setPioneer(true)
            };
        }
    },[props])
  return (
    <Container fluid>
       <Row>
            <Col className='text-start'>
                <h4>ETH Deposits: Daily Breakdown</h4>
                <p>A comprehensive look into your daily Ethereum deposit activities on the Blast platform.</p>
            </Col>
       </Row>
       <Row>
            <Col>
                {props.loading ? (
                    <Spinner animation="grow" className='ms-1'/> 
                ):(
                    arrayEthAct ? (
                        <ResponsiveContainer width='100%' aspect={4.0/3.0}>
                            <ComposedChart data={arrayEthAct} margin={{bottom: 20}}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis axisLine={false} dataKey="date" label={{ value: 'Dates Deposited', position: 'bottom', offset: 0 }}/>
                                <YAxis label={{ value: 'eth', angle: -90, position: 'insideLeft' }}/>
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="ethAcc" fill="#8884d8" stroke="#8884d8"/>
                                <Bar dataKey="eth"  barSize={80} fill="#413ea0" />
                            </ComposedChart>
                        </ResponsiveContainer>
                ): <Alert  variant='primary description'>
                    Introduce your address to display your blast insights.
            </Alert>)}

            </Col>
       </Row>
       {pioneer &&(
        <Row>
            <Col>
                <AlertDismissibleExample/>
            </Col>
        </Row>
       )}

    </Container>
  )
}

export default EthActivity