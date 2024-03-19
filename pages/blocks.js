import React, { useEffect, useState }  from 'react'
import Link from 'next/link';
import { useRouter } from 'next/router';

import {Button, Container, Form, Row, Col, Pagination, Spinner} from 'react-bootstrap';

import alchemy from '../utils/alchemyServer';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
    faCube,
    faL,
    faMagnifyingGlass
} from "@fortawesome/free-solid-svg-icons";

function blocks() {

  const [blocks, setBlocks] = useState([])
  const [numberB, setNumberB] = useState(5)
  const [page, setPage] = useState("1")
  const [pages, setPages] = useState({1:[]})
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [badSearch, setbadSearch] = useState(false)

  const router = useRouter();
  const transformGas = (gas) => {
    gas = parseInt(gas._hex, 16).toString()//wei
    gas = gas.slice(0,2) + '.' + gas.slice(2,3)
    return gas
  }
  
  const submitHandler = (e) =>{
    e.preventDefault()
    if(!search){
      setbadSearch(true)
    }else{
      router.push(`/blocks/${search}`);
    }
  }

  useEffect(() =>{
    
    async function getBlocks(blockN){
      let response = await alchemy.core.getBlock(blockN)
      return response
    }

    async function generateBlocks(){
      setLoading(true);
      
      const blocks_ = []
      
      const latestBlock = await alchemy.core.getBlockNumber();
      
      for (let index = 0; index < 25; index++) {
        const currentBlock = latestBlock - index
        let responeBlock = await getBlocks(currentBlock)

        responeBlock = {...responeBlock, gasUsed: transformGas(responeBlock.gasUsed), gasLimit: transformGas(responeBlock.gasLimit)}
        blocks_.push(responeBlock)
        
      }
      setLoading(false);
      setBlocks(blocks_)
    }

    function generatePages(){
      
      let page = 0
      const pagesC = {}
      const blocksCopy = [...blocks]
      
      while (true) {
        if (blocksCopy.length === 0){
            break
        }
        page += 1
        pagesC[page] = []

        for (let index = 0; index < numberB; index++) {
            if (blocksCopy.length === 0){
                break
            }
            const element = blocksCopy.shift()
            pagesC[page].push(element)
        }
      }
      setPages(pagesC)
    }

    async function main(){
      setPage(1)
      if(blocks.length === 0){
        await generateBlocks()
      }else{
        generatePages()
        
      }
    }
    
    main()
  }, [numberB,blocks])

  return (
    <div className='text-center'>
      <h1><FontAwesomeIcon icon={faCube} className='fs-2 me-2'/>Blocks</h1>
      <h3>Search for specific block.</h3>

      <Container className='d-flex justify-content-center' fluid>
        <Form className='seach-form' onSubmit={submitHandler} >
          <Form.Control placeholder="Block number or hash" value={search} onChange={(e) => setSearch(e.target.value)} />
          <Button variant="primary ms-3" type="submit" className='d-flex align-items-center'>
            Search
          </Button>
        </Form>
      </Container>
      {badSearch ? <p className='empty-search mt-1'>Your search was empty lol. 🚨</p> : null}

      <Container fluid className='mt-3'>
        <Row>
          <Col className='bg-light me-md-3 table' >
            <Container fluid>
              <Row>
                  <Col className='table-title'>
                    <div className='select-div'>
                      <p className='me-2'>Display last </p>
                      <select 
                        value={numberB} 
                        id="numberB"
                        name='numberB'
                        onChange={(e) => setNumberB(e.target.value)}
                      >
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                        <option value="20">20</option>
                        <option value="25">25</option>
                      </select>
                      <p className='ms-2'>blocks. </p>
                    </div>
                  </Col>
                </Row>
                {pages[page]? pages[page].map( (item, index) => {
                return (
                  <Row key={index}>
                    <Col xs={1} md={1}><FontAwesomeIcon icon={faCube} className='fs-4'/></Col>
                    <Col xs={3} md={1}>
                        <div><strong>Block No.</strong></div>
                        <div>
                          <Link href={`/blocks/${item.number}`}>
                            {item.number}
                          </Link>
                        </div>
                    </Col>
                    <Col xs={6} md={3} >
                        <div><strong>Txs No. and Timestamp</strong></div>
                        Contains {item.transactions.length} txs, created at {item.timestamp}
                    </Col>
                    <Col  md={2} className="d-none d-md-block">
                        <div><strong>Hash</strong></div>
                        <div>
                          <Link href={`/blocks/${item.hash}`}>
                            {item.hash.slice(0,20)}..
                          </Link>
                        </div>
                    </Col>
                    <Col  md={2} className="d-none d-md-block">
                        <div><strong>Miner</strong></div>
                        <div>{item.miner.slice(0,20)}..</div>
                    </Col>
                    
                    <Col xs={2} md={2}>
                        <div><strong>Total Gas Used</strong></div>
                        <div ><span className='gas'>{item.gasUsed} M</span></div>
                    </Col>
                    <Col  md={1} className="d-none d-md-block">
                        <div><strong>Gas Limit</strong></div>
                        <div ><span className='gas'>{item.gasLimit} M</span></div>
                    </Col>
                  </Row>
                    )
                  }):null}
            </Container>
          </Col>
        </Row>
        {loading ? (
            <div>
              Loading all blocks <Spinner animation="grow" size="sm" /> 
            </div>
            
          ):(
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
          )}
      </Container>
    </div>
  )
}

export default blocks