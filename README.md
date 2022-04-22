# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

You can clone this project from here - https://github.com/ancutadaniel/ethereum_marketplace_app

## Available Scripts

In the project directory, you can run in terminal:

### `npm install`

1 - Install all dependencies for this project

2 - Check and start the Ganache Blockchain locally

3 - Check Metamask to have proper network selected - RPC - http://127.0.0.1:7545 - custom network

3.a) - You can run this app on Rinkeby Test Network - RPC - https://rinkeby.infura.io/v3/

3.b) - Contract address : 0x5cc653fed47d5F131F60CD2061579901B3aFd727

4 - Import an account from Ganache to have ETH available for transactions

5 - After you install dependencies and prepare Ganache and Metamask you can run:

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

This app is also deployed on Rinkeby Test Network - Contract address :

0x5cc653fed47d5F131F60CD2061579901B3aFd727
