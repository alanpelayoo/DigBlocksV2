import {Card} from 'react-bootstrap';
import { useState, useEffect } from 'react'

import styles from "@/styles/Home.module.css";

import { Utils } from 'alchemy-sdk'; 
import alchemy from '../utils/alchemyServer';
import axios from 'axios';

import GeneralInfo  from '../components/GeneralInfo';
import LastTables  from '../components/LastTables';

export default function Home() {
  
  const [blockNumber, setBlockNumber] = useState("");
  const [gasPrice, setGasPrice] = useState("");
  const [baseFee, setBaseFee] = useState("");
  const [ethPrice, setEthPrice] = useState(null);

  const transformWei = (wei) => {
    wei = parseInt(wei._hex, 16).toString()//wei
    const gwei = Utils.formatUnits(wei, "gwei"); 
    return gwei
  }

  useEffect(() => {
    async function getBlockNumber() {
      const latestBlock = await alchemy.core.getBlockNumber();
      setBlockNumber(latestBlock);
      const {gasPrice:latestGas, lastBaseFeePerGas} =  await alchemy.core.getFeeData();
      setGasPrice(transformWei(latestGas));
      setBaseFee(transformWei(lastBaseFeePerGas));
      try{
        const response = await axios.get('/api/ethPrice');
        setEthPrice(response.data.USD)
      }catch(error){
        setEthPrice(0)
        console.log(error)
      }
    }

    try{
      getBlockNumber();
    }catch(error){
      console.log(error)
    }
    
  },[]);

  return (
    <div>
      <h1>Welcome to DigBlocks.</h1>
      <h4 className={styles.description}>The ultimate ethereum blockchain explorer analytics. </h4>
      <Card className="bg-dark text-white mb-5 eth-world">
        <Card.Img src="/eth-portrait.jpeg" alt="Card image" className='img-eth'/>
        <Card.ImgOverlay>
            <Card.Title>Explore The Ethereum World 🌌</Card.Title>
            <Card.Text>
            Unlock the mysteries of the Ethereum blockchain with our explorer - direct access to the network's nodes for unparalleled transparency and insight!
            </Card.Text>
          </Card.ImgOverlay>
      </Card>
      <GeneralInfo ethPrice={ethPrice} blockNumber={blockNumber} gasPrice={gasPrice} baseFee={baseFee}/>
      <LastTables blockNumber={blockNumber}/>
      
    </div>
  );
}
