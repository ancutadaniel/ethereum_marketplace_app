# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

You can clone this project from here - https://github.com/ancutadaniel/ethereum_marketplace_app

## Available Scripts

In the project directory, you can run in terminal:

### `npm install`

### `truffle compile && truffle migrate --reset`

6 - Run test to see that everything is ok

### `truffle test`

7 - You can check other information on console

### `truffle console`

8 - You can start the app locally running:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.

You may also see any lint errors in the console.

You should be able to create a new task and submit to blockchain

You should be able to mark as done or in progress the task

You can buy or sell products - on test networks

### Deployment Solidity Contracts

- localhost
  `truffle migrate`

- goerli
  `truffle migrate --network goerli`

- to run test
  `truffle test`

- combined
  `truffle compile && truffle migrate --network goerli`
