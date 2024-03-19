import React,{ useEffect, useState } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/router';

import {Button, Container, Form, Row, Col, Pagination, Spinner} from 'react-bootstrap';

import alchemy from '../utils/alchemyServer';
import { Utils } from 'alchemy-sdk';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
    faRightLeft,
    faNoteSticky
} from "@fortawesome/free-solid-svg-icons";

function txs() {
  const [transactions, setTranasactions] = useState([])
  const [numberT, setNumberT] = useState(10)
  const [page, setPage] = useState("1")
  const [pages, setPages] = useState({1:[]})
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [badSearch, setbadSearch] = useState(false)

  const router = useRouter();

  const transformWei = (wei) => {
    wei = parseInt(wei._hex, 16).toString()//wei
    const eth = Utils.formatUnits(wei, "ether"); 
    return eth
  }

  const submitHandler = (e) =>{
    e.preventDefault()
    if(!search){
      setbadSearch(true)
    }else{
      router.push(`/txs/${search}`);
    }
  }

  const txsRows = pages[page] ? pages[page].map( (item, index) => {
    return (
      <Row key={index}>
        <Col xs={1} md={1}><FontAwesomeIcon icon={faNoteSticky} className='fs-4'/></Col>
        <Col  md={1} className="d-none d-md-block">
          <div><strong>Txn Index.</strong></div>
          <div>{item.transactionIndex}</div>
       </Col>
       <Col md={3} className="d-none d-md-block">
          <div><strong>From: </strong>{item.from.slice(0,20)}..</div>
          <div><strong>To:</strong>{item.to.slice(0,20)}..</div>
        </Col>
        <Col xs={7} md={2}>
          <div><strong>Hash</strong></div>
          <Link href={`/txs/${item.hash}`}>
            {item.hash.slice(0,20)}..
          </Link>
        </Col>
        <Col  md={2} className="d-none d-md-block">
          <div><strong>Block No.</strong></div>
          <div>{item.blockNumber}</div>
        </Col>
        <Col  md={1} className="d-none d-md-block">
          <div><strong>Confirmations</strong></div>
          <div>{item.confirmations}</div>
        </Col>
        <Col xs={4} md={2}>
          <div><strong>Value</strong></div>
          <div ><span className='gas'>{item.value.slice(0,7)} ETH</span></div>
        </Col>
      </Row>
  )}):null

  useEffect(() => {

    async function normalizeTransactions(txs){
      const newTxs = []
      //slice txs if more than 100.
      if (txs.length > 100){
        txs = txs.slice(0,100)
      }

      for (let index = 0; index < txs.length; index++) {
        let currentT = txs[index]
        currentT = {...currentT, value:transformWei(currentT.value)}
        newTxs.push(currentT)
      }
      return newTxs
    }

    async function generateTransactions(){
      const latestBlock = await alchemy.core.getBlockNumber();
      let response = await alchemy.core.getBlockWithTransactions(latestBlock)
      let txs = response.transactions
      txs = await normalizeTransactions(txs)
      setTranasactions(txs)
      
    }

    function generatePages(){
      
      let page = 0
      const pagesC = {}
      const txsCopy = [...transactions]
      
      
      while (true) {
        if (txsCopy.length === 0){
            break
        }
        page += 1
        pagesC[page] = []

        for (let index = 0; index < numberT; index++) {
            if (txsCopy.length === 0){
                break
            }
            const element = txsCopy.shift()
            pagesC[page].push(element)
        }
      }
      
      setPages(pagesC)
    }

    async function main(){
      setPage(1)
      if(transactions.length === 0){
        setLoading(true)
        await generateTransactions()
      }
      generatePages()
      setLoading(false)
    }
    main()

  },[transactions, numberT])

  return (
    <div className='text-center'>
      <h1><FontAwesomeIcon icon={faRightLeft} className='fs-2 me-2'/>Transactions</h1>
      <h3>Search for specific transaction.</h3>

      <Container className='d-flex justify-content-center' fluid>
        <Form className='seach-form' onSubmit={submitHandler} >
          <Form.Control placeholder="Transaction hash" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Button variant="primary ms-3" type="submit" className='d-flex align-items-center'>
            Search
          </Button>
        </Form>
      </Container>
      {badSearch ? <p className='empty-search mt-1'>Your search was empty lol. 🚨</p> : null}

      <Container fluid className='mt-5'>
        <Row>
          <Col className='bg-light me-md-3 table' >
            <Container fluid>
              <Row>
                <Col className='table-title'>
                  <div className='select-div'>
                    <p className='me-2'>Display last </p>
                    <select 
                      value={numberT} 
                      id="numberT"
                      name='numberT'
                      onChange={(e) => setNumberT(e.target.value)}
                    >
                      <option value="10">10</option>
                      <option value="15">15</option>
                      <option value="20">20</option>
                      <option value="25">25</option>
                    </select>
                    <p className='ms-2'>transactions. </p>
                  </div>
                </Col>
              </Row>
              {
                loading ? (
                  <Spinner animation="grow"  className='mt-3'/>
                ): txsRows
              }
            </Container>
          </Col>
        </Row>
        <Pagination>
          {Object.keys(pages).map((it,idx)=>{
            return(
              <Pagination.Item key={idx} active={parseInt(it) === parseInt(page)} onClick={() => setPage(it)}>
                {it}
              </Pagination.Item> 
            )
           })
          }
        </Pagination>
      </Container>
    </div>
  )
}

export default txs