import { useRouter } from 'next/router';
import React, {useState, useEffect} from 'react';

import Link from 'next/link';

import {  Container, Col, Row, Button, Card } from 'react-bootstrap'

import { Utils } from 'alchemy-sdk';
import alchemy from '../../utils/alchemyServer';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faCube,
  faArrowLeft,
  faArrowRight,
  faHouse,
  faRightLeft
} from "@fortawesome/free-solid-svg-icons";

const TransactionDetailPage = () => {
  const router = useRouter();
  const { id } = router.query; // Access the dynamic part of the URL
  

  const [transaction, setTransaction] = useState({})
  const [errorM, setErorrM] = useState(null)

  const transformWei = (wei, toUnit) => {
    wei = parseInt(wei._hex, 16).toString()//wei
    const eth = Utils.formatUnits(wei, toUnit); 
    return eth
  }

  useEffect(() => {
    async function getTxn(){
      setErorrM(false)
      try {
        let response = await alchemy.transact.getTransaction(id)
        if(!response){
          throw response
        }
        response = {...response, value:transformWei(response.value, "ether"), gasPrice: transformWei(response.gasPrice, "gwei")}
        
        setTransaction(response)
      } catch (error) {
        
        console.log(error)
        setErorrM("No Transaction found")
      }
    }

    getTxn()
  }, [])

  return (
    <div>
      {errorM ? (
        // <h1>Sorry we couldn´t find block you requested, {stringId}</h1>
        <Card className="bg-dark text-white  not-found">
          <Card.Img src="/not-found.jpeg" alt="Card image" className='img-eth'/>
          <Card.ImgOverlay>
            <h1>Sorry, </h1>
            <h1>We couldn´t find transaction you requested, {id}.</h1>
            <Card.Text className='mt-2'>
              <Link href={`/txs`}><Button variant="light" > Back to transactions <FontAwesomeIcon icon={faHouse} className='ms-1'/></Button></Link>   
            </Card.Text>
          </Card.ImgOverlay>
        </Card> 
      ):(
        <div>
          <h1><FontAwesomeIcon icon={faRightLeft}/> Transaction <span className='block-num'>#{transaction.transactionIndex}</span> in block <span className='block-num'>#{transaction.blockNumber}</span></h1>
          <hr></hr>
          <h3>Transaction Details</h3>
          <Container className=' block-info bg-light' fluid>
          <Row className='block-info-row mb-2'>
                <Col md={2}>
                  <p className=''><strong>Hash:</strong></p>
                </Col>
                <Col>
                  <p className='block-text'>{transaction.hash}</p>
                </Col>
              </Row>
              <Row className='block-info-row mb-2'>
                <Col md={2}>
                  <p className=''><strong>From:</strong></p>
                </Col>
                <Col>
                  <p className='block-text'>{transaction.from}</p>
                </Col>
              </Row>
              <Row className='block-info-row mb-2'>
                <Col md={2}>
                  <p className=''><strong>To:</strong></p>
                </Col>
                <Col>
                  <p className='block-text'>{transaction.to}</p>
                </Col>
              </Row>
              <Row className='block-info-row mb-2'>
                <Col md={2}>
                  <p className=''><strong>Block No:</strong></p>
                </Col>
                <Col>
                  <Link href={`/blocks/${transaction.blockNumber}`}>
                    <p className='block-text'>{transaction.blockNumber}</p>
                  </Link>  
                </Col>
              </Row>
              <Row className='block-info-row mb-2'>
                <Col md={3}>
                  <p className=''><strong>Transaction Index:</strong></p>
                </Col>
                <Col>
                  <p className='block-text'>{transaction.transactionIndex}</p>
                </Col>
              </Row>
              <Row className='block-info-row mb-2'>
                <Col md={3}>
                  <p className=''><strong>Confirmations:</strong></p>
                </Col>
                <Col>
                  <p className='block-text'>{transaction.confirmations}</p>
                </Col>
              </Row>
              <Row className='block-info-row mb-2'>
                <Col md={2}>
                  <p className=''><strong>Value:</strong></p>
                </Col>
                <Col>
                  <p className='block-text'>{transaction.value} ETH</p>
                </Col>
              </Row>
              <Row className='block-info-row mb-2'>
                <Col md={2}>
                  <p className=''><strong>Gas Price:</strong></p>
                </Col>
                <Col>
                  <p className='block-text'>{transaction.gasPrice} gwei</p>
                </Col>
              </Row>
          </Container>
        </div>
      )}
      
    </div>
  );
}

export default TransactionDetailPage;