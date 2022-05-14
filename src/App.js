import { useCallback, useEffect, useReducer } from 'react';
import { reducer } from './redux_hooks/redux';
import { defaultState } from './redux_hooks/state';
import * as ACTIONS from './redux_hooks/constants';
import {
  Container,
  Grid,
  GridRow,
  GridColumn,
  Segment,
  Dimmer,
  Loader,
  Divider,
  Message,
  Button,
  Icon,
} from 'semantic-ui-react';
import getWeb3 from './utils/getWeb3';
import Marketplace from './build/abis/Marketplace.json';
import Menu from './components/Menu';

import './App.css';
import Products from './components/Products';
import AddProduct from './components/AddProduct';

const App = () => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const { errors, loading, account } = state;
  const { SET_WEB3, SET_ERROR } = ACTIONS;

  const loadWeb3 = useCallback(async () => {
    try {
      const web3 = await getWeb3();
      if (web3) {
        const getAccounts = await web3.eth.getAccounts();
        // get networks id of deployed contract
        const getNetworkId = await web3.eth.net.getId();
        // get contract data on this network
        const marketplaceData = await Marketplace.networks[getNetworkId];
        if (marketplaceData) {
          // get contract deployed address
          const contractAddress = marketplaceData.address;
          // create a new instance of the contract - on that specific address
          const contractData = await new web3.eth.Contract(
            Marketplace.abi,
            contractAddress
          );

          dispatch({
            type: SET_WEB3,
            value: {
              web3: web3,
              contract: contractData,
              account: getAccounts,
              loading: false,
            },
          });
        } else {
          alert('Smart contract not deployed to selected network');
        }
      }
    } catch (error) {
      dispatch({ type: SET_ERROR, value: error });
    }
  }, [SET_WEB3, SET_ERROR]);

  useEffect(() => {
    loadWeb3();
  }, [loadWeb3]);

  return (
    <div className='App'>
      <Menu account={account} />
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
              <Products state={state} dispatch={dispatch} />
            </Segment>
          </Container>
          <Divider horizontal>Or</Divider>
          <Container>
            <Segment>
              Add New Product
              <Divider />
              <AddProduct state={state} dispatch={dispatch} />
            </Segment>
          </Container>
        </>
      )}
      <Divider horizontal>§</Divider>
      <Container>
        {errors && (
          <Message negative>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Message.Header>Code: {errors?.code}</Message.Header>
              <Button
                style={{
                  padding: '0px',
                  background: 'none',
                  color: 'red',
                  marginRight: '0px',
                }}
                onClick={() => dispatch({ type: SET_ERROR, value: null })}
              >
                <Icon name='close' />
              </Button>
            </div>

            <p style={{ wordWrap: 'break-word' }}>{errors?.message}</p>
          </Message>
        )}
      </Container>
    </div>
  );
};

export default App;
