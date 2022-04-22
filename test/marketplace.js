const Marketplace = artifacts.require('Marketplace');
const chai = require('chai');

chai.use(require('chai-as-promised')).should();

contract('Marketplace', async ([deployer, seller, buyer]) => {
  let marketplace;

  before(async () => {
    marketplace = await Marketplace.deployed();
    console.log(marketplace.address);
  });

  describe('deployment of the contract', async () => {
    it('contract deployed successfully and has a address', async () => {
      const address = await marketplace.address;

      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
      assert.isString(address);
    });

    it('check the name of the contract', async () => {
      const name = await marketplace.name();
      assert.equal(name, 'Marketplace', 'Contract has no name set');
    });
  });

  describe('products', async () => {
    let productCount, product, result;

    before(async () => {
      productCount = await marketplace.productCount();
      result = await marketplace.createProduct(
        'MacBook Pro 64GB',
        web3.utils.toWei('4', 'ether'),
        { from: seller }
      );
      product = await marketplace.products(productCount);
    });

    it('productCount is correct incremented', async () => {
      assert.equal(
        productCount.toNumber(),
        1,
        'productCount should be incremented to 1'
      );
    });

    it('contract has created a default product', async () => {
      assert.equal(
        product.id.toNumber(),
        productCount.toNumber(),
        'product should have the same id as product count'
      );
      assert.equal(product.name, 'MacBook Pro', 'should have the correct name');
      assert.equal(
        product.owner,
        deployer,
        'address of owner should be the same for first product deployed'
      );
    });

    it('create a new product and emit an event', async () => {
      // Success
      // check the event has trigger
      const event = await result.logs[0].args;
      const productCount = await marketplace.productCount();

      assert.equal(productCount.toNumber(), 2, 'productCount not incremented');
      assert.equal(event.id.toNumber(), productCount.toNumber());
      assert.equal(event.name, 'MacBook Pro 64GB');
      assert.equal(event.price, web3.utils.toWei('4', 'ether'));
      assert.equal(
        event.owner,
        seller,
        'address should be equal to address that call this fct'
      );
      assert.isFalse(event.purchased, 'status should be false');

      // Failure - product must have a name
      await marketplace.createProduct('', web3.utils.toWei('4', 'ether'), {
        from: seller,
      }).should.be.rejected;

      // Failure - product must have a price, and greater than 0
      await marketplace.createProduct('Name', 0, {
        from: seller,
      }).should.be.rejected;
    });

    it('list products from mapping', async () => {
      const productCount = await marketplace.productCount();
      const product = await marketplace.products(productCount);

      assert.equal(product.id, productCount.toNumber());
      assert.equal(product.name, 'MacBook Pro 64GB');
      assert.equal(product.price, web3.utils.toWei('4', 'ether'));
      assert.equal(
        product.owner,
        seller,
        'address should be equal to address that call this fct'
      );
      assert.isFalse(product.purchased, 'status should be false');
    });

    it('purchase products', async () => {
      // Track the seller balance before purchase
      let oldSellerBalance;
      oldSellerBalance = await web3.eth.getBalance(seller);
      // Format balance
      oldSellerBalance = new web3.utils.BN(oldSellerBalance);

      // Success buyer makes purchase
      const productCount = await marketplace.productCount();
      result = await marketplace.purchaseProduct(productCount, {
        from: buyer,
        value: web3.utils.toWei('4', 'ether'),
      });

      // Check the event has trigger
      const event = await result.logs[0].args;

      assert.equal(event.id.toNumber(), productCount.toNumber());
      assert.equal(event.name, 'MacBook Pro 64GB');
      assert.equal(event.price, web3.utils.toWei('4', 'ether'));
      assert.equal(
        event.owner,
        buyer,
        'address should be equal to address that call this fct'
      );
      assert.isTrue(event.purchased, 'status should be false');

      // Check seller receive the funds
      let newSellerBalance;
      newSellerBalance = await web3.eth.getBalance(seller);
      newSellerBalance = new web3.utils.BN(newSellerBalance);

      let price;
      price = await web3.utils.toWei('4', 'ether');
      price = new web3.utils.BN(price);

      // Calculate balance with add fct from BN  - old balance + price
      const expectedBalance = oldSellerBalance.add(price);
      console.log(expectedBalance.toString(), newSellerBalance.toString());
      assert.equal(
        newSellerBalance.toString(),
        expectedBalance.toString(),
        'Balance should be the same'
      );

      // Failure - product that not exist - invalid id
      await marketplace.purchaseProduct(99, {
        from: buyer,
        value: web3.utils.toWei('4', 'ether'),
      }).should.be.rejected;

      // Failure - product was already purchased
      await marketplace.purchaseProduct(productCount, {
        from: buyer,
        value: web3.utils.toWei('4', 'ether'),
      }).should.be.rejected;

      // Failure - product received less ETH
      await marketplace.purchaseProduct(1, {
        from: buyer,
        value: web3.utils.toWei('2', 'ether'),
      }).should.be.rejected;

      // Failure - seller can not be the buyer
      await marketplace.purchaseProduct(1, {
        from: deployer,
        value: web3.utils.toWei('3', 'ether'),
      }).should.be.rejected;
    });
  });
});
