import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
    faCube,
    faGasPump, 
    faCommentsDollar
} from "@fortawesome/free-solid-svg-icons";
import { faEthereum } from "@fortawesome/free-brands-svg-icons";
function GeneralInfo(props) {
  return (
    <div id='info'>
        <h2>Last Chain Data</h2>
        <Container  className='info bg-light'>
            <Row>
                <Col className='info1 d-flex justify-content-start align-items-center px-3 py-1' xs={12} md={6}>
                    <div >
                        <FontAwesomeIcon icon={faCube} className='info-icon'/>
                    </div>
                    <div className='ms-4'>
                        <p className='info-title'>Last Block</p>
                        <p className='fs-5'>{props.blockNumber}</p>
                    </div>
                </Col>
                <Col className='info2 d-flex justify-content-start align-items-center px-3 py-1' xs={12} md={6}>
                    <div >
                        <FontAwesomeIcon icon={faGasPump} className='info-icon'/>
                    </div>
                    <div className='ms-4'>
                        <p className='info-title'>Gas Price</p>
                        <p className='fs-5'>{props.gasPrice} gwei </p>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col className='info3 d-flex justify-content-start align-items-center px-3 py-1' xs={12} md={6}>
                    <div >
                        <FontAwesomeIcon icon={faEthereum} className='info-icon'/>
                    </div>
                    <div className='ms-4'>
                        <p className='info-title'>Eth Price</p>
                        <p className='fs-5'> ${props.ethPrice} </p>
                    </div>
                </Col>
                <Col className='info4 d-flex justify-content-start align-items-center px-3 py-1' xs={12} md={6}>
                    <div >
                        <FontAwesomeIcon icon={faCommentsDollar} className='info-icon'/>
                    </div>
                    <div className='ms-4  '>
                        <p className='info-title'>Last Base Fee</p>
                        <p className='fs-5'>{props.baseFee} gwei</p>
                    </div>
                </Col>
            </Row>
        </Container>
    </div>
  )
}

export default GeneralInfo