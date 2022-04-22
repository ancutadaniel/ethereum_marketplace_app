// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract Marketplace {
  string public name;
  uint public productCount = 0;
  address payable public owner;

  struct Product {
    uint id;
    string name;
    uint price;
    address payable owner;
    bool purchased;
  }

  mapping(uint => Product) public products;

  constructor() {
    name = "Marketplace";
    owner = payable(msg.sender);
    createProduct("MacBook Pro", 3000000000000000000);
  }

  event ProductCreated(uint id,string name,uint price,address owner,bool purchased);
  event ProductPurchased(uint id, string name,uint price, address owner, bool purchased);

  function createProduct(string memory _name, uint _price) public {
    require(bytes(_name).length > 0, 'name should not be empty');
    require(_price > 0, 'price should not be 0');

    productCount += 1;
    products[productCount] = Product(productCount, _name, _price, payable(msg.sender), false);
    emit ProductCreated(productCount, _name, _price, msg.sender, false);  
  }

  function purchaseProduct(uint _id) public payable {
    // fetch product  
    Product memory _product = products[_id];
    // fetch owner
    address payable seller = _product.owner;
    // check if product is valid 
    require(!_product.purchased, 'product already purchased');
    // make sure the product has a correct id
    require(_product.id > 0 && _product.id <= productCount, 'id is invalid'); 
    // make sure that is enough ETH in transaction
    require(msg.value >= _product.price, 'the amount of purchase in not enough');
    // make sure that the buyer is not the seller 
    require(seller != msg.sender, 'you are not allow to buy your own product');

    // purchase it    
    _product.owner = payable(msg.sender);
    _product.purchased = true;
    // update the product in mapping
    products[_id] = _product;
    // pay the seller by sending them ether
    seller.transfer(msg.value);

    // triger event 
    emit ProductPurchased(_id, _product.name, _product.price, msg.sender, _product.purchased);
  }
}
