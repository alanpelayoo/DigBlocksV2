import axios from 'axios';
import alchemy from '../../utils/alchemyServer';


/*
All dates are in UTC time.
*/ 


export default async function handler(req, res) {
    let totalEth = 0;
    let totalUsd = 0;
    let ethAcc = 0
    const user = {
        address: req.query.addressU,
        total: [0, 0], // in eth, usd
        eth: { total: [] },
        stables: { total: []},
        txs:[],
        daily_activity:{}
    };

    try {
        // Get eth current price.
        let response = await axios.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD', {
            headers: {
                'Apikey': process.env.CRYPTO_API_KEY, // Adjusted for server-side variable
            },
        });
        const ethCurrentPrice = response.data.USD;
    
        // Retrieve address send txs with blast deposit.
        response = await alchemy.core.getAssetTransfers({
            fromAddress: user.address,
            toAddress: "0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d",
            excludeZeroValue: true,
            category: ["erc20", "external"],
            withMetadata: true,
        });

        const transactions = response['transfers'];

        await Promise.all(transactions.map(txn => processTxnData(txn, ethCurrentPrice)));

        user['total'][0] = totalEth+totalUsd/ethCurrentPrice;
        user['total'][1] = totalEth*ethCurrentPrice+totalUsd;

        user['eth']['total'] = [totalEth, totalEth*ethCurrentPrice];
        user['stables']['total'] = [totalUsd/ethCurrentPrice, totalUsd];

        user['txs'].sort((a, b) => a.timestamp - b.timestamp);
        
        //formulate dailyActivity obj
        
        user['txs'].map(txn => processDaily(txn))

        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

    async function processTxnData(txn, ethCurrentPrice) {
        const timestamp = Math.floor(Date.parse(txn['metadata']['blockTimestamp']) / 1000);
        let txnInfo = null
        if (txn['asset'] === 'ETH') {
            totalEth += parseFloat(txn['value']);
            
            //get daily close of the date when txn was executed.
            const response = await axios.get(`https://min-api.cryptocompare.com/data/pricehistorical?fsym=ETH&tsyms=USD&ts=${timestamp}`, {
                headers: {
                    'Apikey': process.env.CRYPTO_API_KEY,
                },
            });
            const ethChange = ((ethCurrentPrice - response.data.ETH.USD)/response.data.ETH.USD)*100;
            const stakeValATM = txn['value']*response.data.ETH.USD//usd value of your stake atm.
            txnInfo = {type:"eth", qty:txn['value'], date:txn['metadata']['blockTimestamp'],timestamp:timestamp, ethPriceATM:response.data.ETH.USD,appreciation:ethChange, stakeValATM:stakeValATM}
        } else {
            totalUsd += parseFloat(txn['value']);
            txnInfo = {type:'usd',qty:txn['value'], date:txn['metadata']['blockTimestamp'], timestamp:timestamp}
        }
        user['txs'].push(txnInfo);
    }

    function processDaily(txn){
        const shortDate = txn.date.substring(0, 10);
        if (txn.type !== 'eth'){
            return
        }
        ethAcc += txn.qty;
        if (!(shortDate in user.daily_activity)){
            user.daily_activity[shortDate] = {eth:0, ethAcc:ethAcc}
            user.daily_activity[shortDate][txn.type] = txn.qty
        }else{
            user.daily_activity[shortDate][txn.type] += txn.qty
            user.daily_activity[shortDate].ethAcc = ethAcc
        }
    }
}