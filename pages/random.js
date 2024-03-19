const [user_stakes, setUserStakes] = useState({'eth':[],'stables':[]})

  useEffect(() => { 
    const main = async () => {
      const stakes = {'eth':[],'stables':[]};

      let toAddress = "0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d";
    //The response fetches the transactions the specified addresses.
      let response = await alchemy.core.getAssetTransfers({
          fromAddress: "0x78F8C07903d81a0e460102c30943A4598ab72F80",
          toAddress:toAddress,
          excludeZeroValue: true,
          category: ["erc20", "external"],
          withMetadata: true,
        })
      //Logging the response to the console
      console.log("Initial call",response['transfers'])
      response['transfers'].map(async (txn)=>{
        // get date (from txn hash)
        if (txn['asset'] === 'ETH'){
          stakes['eth'].push([txn['value'], txn['metadata']['blockTimestamp']])
        }else{
          stakes['stables'].push([txn['value'], txn['metadata']['blockTimestamp']])
        }
      })
      console.log(stakes)
    }
    main()
  },[]);