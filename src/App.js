import { useCallback, useEffect, useState } from 'react';
import {
  Container,
  Grid,
  GridRow,
  GridColumn,
  Segment,
  Dimmer,
  Loader,
  Divider,
} from 'semantic-ui-react';
import getWeb3 from './utils/getWeb3';
import Marketplace from './build/abis/Marketplace.json';
import Menu from './components/Menu';

import './App.css';
import Products from './components/Products';
import AddProduct from './components/AddProduct';

const App = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contract, setContract] = useState({});
  const [products, setProducts] = useState([]);

  const [web3, setWeb3] = useState({});

  const loadWeb3 = async () => {
    try {
      const web3 = await getWeb3();

      if (web3) {
        const getAccounts = await web3.eth.getAccounts();
        // get networks id of deployed contract
        const getNetworkId = await web3.eth.net.getId();
        // get contract data on this network
        const marketplaceData = await Marketplace.networks[getNetworkId];
        // get contract deployed address
        const contractAddress = marketplaceData.address;
        // create a new instance of the contract - on that specific address
        const contractData = await new web3.eth.Contract(
          Marketplace.abi,
          contractAddress
        );

        setWeb3(web3);
        setAccounts(getAccounts);
        setContract(contractData);

        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const showProducts = useCallback(async () => {
    setLoading(true);
    try {
      const productCount = await contract.methods.productCount().call();
      let productsArr = [];
      for (let i = 1; i <= productCount; i++) {
        const product = await contract.methods.products(i).call();
        const { id, name, owner, price, purchased } = product;

        productsArr.push({
          id: +id,
          name,
          owner,
          price,
          purchased,
        });
      }

      setProducts(productsArr);
      setLoading(false);
    } catch (error) {
      console.log(error);
      alert(
        'Check if Smart Contract is compiled and deployed, run truffle compile && truffle migrate --reset'
      );
    }
  }, [contract.methods]);

  useEffect(() => {
    if (contract && contract?.options?.address) showProducts();
  }, [contract, showProducts]);

  useEffect(() => {
    loadWeb3();
  }, []);

  return (
    <div className='App'>
      <Menu account={accounts[0]} />
      {loading && (
        <Container>
          <Grid columns={1}>
            <GridRow>
              <GridColumn>
                <Segment style={{ height: 150 }}>
                  <Dimmer active>
                    <Loader size='medium'>Loading</Loader>
                  </Dimmer>
                </Segment>
              </GridColumn>
            </GridRow>
          </Grid>
        </Container>
      )}
      {!loading && (
        <>
          <Container>
            <Segment>
              Products Available
              <Divider />
              <Products
                products={products}
                web3={web3}
                contract={contract}
                accounts={accounts}
                showProducts={showProducts}
              />
            </Segment>
          </Container>
          <Divider horizontal>Or</Divider>
          <Container>
            <Segment>
              Add New Product
              <Divider />
              <AddProduct
                web3={web3}
                contract={contract}
                accounts={accounts}
                showProducts={showProducts}
              />
            </Segment>
          </Container>
        </>
      )}
    </div>
  );
};

export default App;
