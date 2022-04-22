import { Table, Icon, Button } from 'semantic-ui-react';

const Products = ({ products, web3, contract, accounts, showProducts }) => {
  const [header] = products.map((item) => {
    let arr = [];
    arr = [...Object.keys(item)];
    arr.push('');
    return arr;
  });

  const handlePurchaseProduct = async (id, price) => {
    try {
      await contract.methods
        .purchaseProduct(id)
        .send({ from: accounts[0], value: price });
      showProducts();
    } catch (error) {
      console.log(error);
    }
  };

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
