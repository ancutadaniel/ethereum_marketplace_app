import { Button, Form } from 'semantic-ui-react';
import * as ACTIONS from '../redux_hooks/constants';

const AddProduct = ({ state, dispatch }) => {
  const { contract, web3, account, productName, productPrice, loading } = state;
  const {
    SET_ERROR,
    SET_PRODUCT_NAME,
    SET_PRODUCT_PRICE,
    SET_FORM_LOADING,
    RESET_FORM,
  } = ACTIONS;

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: SET_FORM_LOADING });
    try {
      const price = web3.utils.toWei(productPrice.toString(), 'ether');
      await contract.methods
        .createProduct(productName, price)
        .send({ from: account });

      dispatch({ type: RESET_FORM });
    } catch (error) {
      dispatch({ type: SET_ERROR, value: error });
    }
  };

  const handleProductName = (e) => {
    dispatch({ type: SET_PRODUCT_NAME, value: e.target.value });
  };

  const handleProductPrice = (e) => {
    +e.target.value <= 0
      ? dispatch({
          type: SET_ERROR,
          value: new Error('You should enter a value higher than 0'),
        })
      : dispatch({ type: SET_ERROR, value: null });
    dispatch({ type: SET_PRODUCT_PRICE, value: e.target.value });
  };

  return (
    <Form onSubmit={handleSubmit} loading={loading}>
      <Form.Input
        label='Product Name'
        placeholder='Product Name'
        name='productName'
        value={productName}
        onChange={handleProductName}
        required
      />
      <Form.Input
        label='Product Price - ETH'
        name='productPrice'
        value={productPrice}
        onChange={handleProductPrice}
        required
        type='text'
      />

      <Button
        color='purple'
        type='submit'
        disabled={productName === '' || productPrice === 0}
      >
        Submit New Product
      </Button>
    </Form>
  );
};

export default AddProduct;
