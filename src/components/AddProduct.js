import { useState } from 'react';
import { Button, Form, Message } from 'semantic-ui-react';

const AddProduct = ({ contract, accounts, web3, showProducts }) => {
  const [loading, setLoading] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState(0);
  const [errorStatus, setErrorStatus] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const price = web3.utils.toWei(productPrice.toString(), 'ether');
      await contract.methods
        .createProduct(productName, price)
        .send({ from: accounts[0] });
      showProducts();
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleProductName = (e) => {
    setProductName(e.target.value);
  };

  const handleProductPrice = (e) => {
    try {
      if (e.target.value === '') throw new Error();
      setProductPrice(e.target.value);
      setErrorStatus(false);
    } catch (error) {
      setErrorStatus(true);
    }
  };

  return (
    <Form onSubmit={handleSubmit} loading={loading} error={errorStatus}>
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
        type='number'
        min='0'
      />
      <Message
        error
        header='Action Forbidden'
        content={'Cannot set price to empty!!!'}
      />
      <Button color='purple' type='submit'>
        Submit New Product
      </Button>
    </Form>
  );
};

export default AddProduct;
