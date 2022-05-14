import { useCallback, useEffect } from 'react';
import { Table, Icon, Button } from 'semantic-ui-react';
import * as ACTIONS from '../redux_hooks/constants';

const Products = ({ state, dispatch }) => {
  const { contract, web3, account, products, header, loadProducts } = state;

  const { SET_ERROR, SET_PRODUCTS } = ACTIONS;

  const showProducts = useCallback(async () => {
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

      dispatch({ type: SET_PRODUCTS, value: productsArr });
    } catch (error) {
      dispatch({ type: SET_ERROR, value: error });
    }
  }, [SET_ERROR, SET_PRODUCTS, contract.methods, dispatch]);

  const handlePurchaseProduct = useCallback(
    async (id, price) => {
      try {
        await contract.methods
          .purchaseProduct(id)
          .send({ from: account, value: price });
        showProducts();
      } catch (error) {
        dispatch({ type: SET_ERROR, value: error });
      }
    },
    [showProducts, contract.methods, dispatch, SET_ERROR, account]
  );

  useEffect(() => {
    loadProducts && showProducts();
  }, [loadProducts, showProducts]);

  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          {header.map((headerName, i) => {
            return (
              <Table.HeaderCell key={i}>
                {headerName.toUpperCase()}
              </Table.HeaderCell>
            );
          })}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {products.map((product) => {
          const { id, name, owner, price, purchased } = product;
          const formatPrice = web3.utils.fromWei(price);

          return (
            <Table.Row key={id}>
              <Table.Cell>{id}</Table.Cell>
              <Table.Cell>{name}</Table.Cell>
              <Table.Cell>{owner}</Table.Cell>
              <Table.Cell>{formatPrice} ETH</Table.Cell>
              {!purchased ? (
                <Table.Cell positive>
                  <Icon name='checkmark' />
                  Available
                </Table.Cell>
              ) : (
                <Table.Cell negative>
                  <Icon name='close' />
                  Not Available
                </Table.Cell>
              )}
              <Table.Cell disabled={purchased} textAlign='center'>
                <Button
                  color='green'
                  onClick={() => handlePurchaseProduct(id, price)}
                  disabled={purchased}
                >
                  Buy
                </Button>
              </Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table>
  );
};

export default Products;
