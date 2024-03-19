import React, { useEffect, useState }  from 'react';
import {Button, Container, Form, Row, Col, Spinner} from 'react-bootstrap';
import axios from 'axios';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faLayerGroup,
  faLock,
  faBars,
  faCircleInfo
} from "@fortawesome/free-solid-svg-icons";


import EthActivity from '../components/EthActivity';
import BlastPie from '../components/BlastPie';

import Info from '../components/Info';

function blast() {
  /*
  Logic is simple, search using address  ->  submitHandler -> queries api that handles all info.
  
  */
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false)
  const [badSearch, setbadSearch] = useState(false);
  const [user, setUser] = useState({'address':null,'eth':[],'stables':[]})


  const submitHandler = async (e) =>{
    e.preventDefault()
    setbadSearch(false)
    setUser({'address':null,'eth':[],'stables':[]})
    
    if(!search){
      setbadSearch("Please check the address you entered.")
    }else{
      setLoading(true);
      try{
        //query user data
        const response = await axios.get(`/api/blastPoint?addressU=${search}`)
        setUser(response.data);
      }catch(error){
        console.log(error)
        setbadSearch("Sorry, we are having internal issues right.")
      }
      setLoading(false);
    }
  }

  useEffect(() => { 
    console.log(user)
  },[user]);

  return (
    <div className='text-center'>
      <h1><FontAwesomeIcon icon={faLayerGroup} className='fs-2 me-2'/>Blast analytics</h1>
      <h3>Get your blast analytics.</h3>
      <Container className='d-flex justify-content-center' fluid>
        <Form className='seach-form' onSubmit={submitHandler} >
          <Form.Control placeholder="Enter your address..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <Button variant="primary ms-3" type="submit" className='d-flex align-items-center'>
            Search
          </Button>
        </Form>
      </Container>
  
      {loading ? (
        <div className='mt-2'>
          Searching <Spinner animation="grow" size="sm" className='ms-1'/> 
        </div>
        ):null}
      {badSearch ? <p className='empty-search mt-1'>{badSearch} 🚨</p> : null}
      {user.address && (
        <Container  className='mt-5 top bg-light text-start px-4 py-2 d-flex align-items-center'>
          <FontAwesomeIcon icon={faLock} className='icon me-1 '/>
          <p className='tit'>Your TVL:</p>
          <p className='ms-1'>{user.total[0].toFixed(3)} eth</p>
          <p className='ms-1 ex'>|</p>
          <p className='ms-1'>${user.total[1].toLocaleString()} USD</p>
          <FontAwesomeIcon icon={faBars} className='icon ms-3 me-1'/>
          <p className='tit '>Assets Locked:</p>
          <p className='ms-1'>{user.eth.total[0].toFixed(3)} eth</p>
          <p className='ms-1 ex'>|</p>
          <p className='ms-1'>${user.stables.total[1].toLocaleString()} USD</p>
          <Info tooltipMessage="Value is calculated according to current eth price.">
            <FontAwesomeIcon icon={faCircleInfo} className='icon-2 ms-2'/>
          </Info>
          
        </Container>
        
      )}
      
      <Container  className='mt-3'>
        <h2 className='text-start'>Dashboard</h2>
        <Row>
          <Col className='bg-light me-md-3 table'>
            <EthActivity dailyActivity={user.daily_activity} loading={loading}/>
          </Col>
          <Col className='bg-light table'>
            <BlastPie ethTotal={user.eth.total} usdTotal={user.stables.total} loading={loading}/>
          </Col>
        </Row>
      </Container>
      
    </div>
  )
}

export default blast