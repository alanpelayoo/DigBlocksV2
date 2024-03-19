import { useRouter } from 'next/router';
import React, {useState, useEffect} from 'react';

import Link from 'next/link';

import {  Container, Col, Row, Button, Card } from 'react-bootstrap'
import alchemy from '../../utils/alchemyServer';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
    faCube,
    faArrowLeft,
    faArrowRight,
    faHouse
} from "@fortawesome/free-solid-svg-icons";

const BlockDetailPage = () => {
  const router = useRouter();
  const { id } = router.query; // Access the dynamic part of the URL
  const stringId = `${id}`;

  const [block, setBlock] = useState({transactions:[]})
  const [errorM, setErorrM] = useState(null)

  const transformGas = (gas) => {
    gas = parseInt(gas._hex, 16).toString()//wei
    gas = gas.slice(0,2) + '.' + gas.slice(2,3)
    return gas
  }

  useEffect(()=>{
    async function getBlocks(){
      setErorrM(false)
      let intOrHash = null

      if(stringId[1] !== 'x'){
        intOrHash = parseInt(stringId)
      }else{
        intOrHash = stringId
      }

      try {
        let response = await alchemy.core.getBlock(intOrHash)
        console.log(response)
        if(!response){
          throw "Block Null"
        }
        let responseBlock = response
        responseBlock = {...response, gasUsed: transformGas(responseBlock.gasUsed), gasLimit: transformGas(responseBlock.gasLimit) }
        setBlock(responseBlock)
      } catch (error) {
        console.log(error)
        setErorrM("No Block found")
      }
    }

    getBlocks()
  }, [stringId])

  return (
    <div>
      {errorM ? (
        // <h1>Sorry we couldn´t find block you requested, {stringId}</h1>
        <Card className="bg-dark text-white  not-found">
          <Card.Img src="/not-found.jpeg" alt="Card image" className='img-eth'/>
          <Card.ImgOverlay>
            <h1>Sorry, </h1>
            <h1>We couldn´t find block you requested, {stringId}.</h1>
            <Card.Text className='mt-2'>
              <Link href={`/blocks`}><Button variant="light" > Back to blocks <FontAwesomeIcon icon={faHouse} className='ms-1'/></Button></Link>   
            </Card.Text>
          </Card.ImgOverlay>
        </Card> 
      ):(
        <div>
          <h1><FontAwesomeIcon icon={faCube}/> Block <span className='block-num'>#{block.number}</span></h1>
          <hr></hr>
          <h3>Block Overview</h3>
          <Container className=' block-info bg-light' fluid>
          <Row className='block-info-row mb-2'>
              <Col md={2}>
                <p className=''><strong>Hash:</strong></p>
              </Col>
              <Col>
                <p className='block-text'>{block.hash}</p>
              </Col>
            </Row>
            <Row className='block-info-row mb-2'>
              <Col md={2}>
                <p className=''><strong>Parent Hash:</strong></p>
              </Col>
              <Col>
                <p className='block-text'>{block.parentHash}</p>
              </Col>
            </Row>
            <Row className='block-info-row mb-2'>
              <Col md={2}>
                <p className=''><strong>Block No.:</strong></p>
              </Col>
              <Col>
                <p className='block-text'>{block.number}</p>
              </Col>
            </Row>
            <Row className='block-info-row mb-2'>
              <Col md={2}>
                <p className=''><strong>Timestamp:</strong></p>
              </Col>
              <Col>
                <p className='block-text'>{block.timestamp}</p>
              </Col>
            </Row>
            <Row className='block-info-row mb-2'>
              <Col md={2}>
                <p className=''><strong>Gas Limit:</strong></p>
              </Col>
              <Col>
                <p className='block-text'>{block.gasLimit} M</p>
              </Col>
            </Row>
            <Row className='block-info-row mb-2'>
              <Col md={2}>
                <p className=''><strong>Gas Used:</strong></p>
              </Col>
              <Col>
                <p className='block-text'>{block.gasUsed} M</p>
              </Col>
            </Row>
            <Row className='block-info-row '>
              <Col md={2}>
                <p className=''><strong>Transactions:</strong></p>
              </Col>
              <Col>
                <p className='block-text'>Contains {block.transactions.length} txs.</p>
              </Col>
            </Row>
            <Row className='block-info-row '>
              <Col md={2}>
                <p className=''><strong>Miner:</strong></p>
              </Col>
              <Col>
                <p className='block-text'>{block.miner}</p>
              </Col>
            </Row>
          </Container>
          <Container fluid className='d-flex justify-content-between mt-3'>
            <Link href={`/blocks/${block.number + 1}`}><Button variant="outline-primary" > <FontAwesomeIcon icon={faArrowLeft} className='me-1'/>  Next Block</Button></Link>
            <Link href={`/blocks/${block.number - 1}`}><Button variant="outline-primary" > Prev Block <FontAwesomeIcon icon={faArrowRight} className='ms-1'/></Button></Link>
          </Container>
        </div>
      )}
    </div>
  );
}

export default BlockDetailPage;