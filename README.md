<h1 align="center">
  Polygon 💜🤝 Coinbase Smart Wallet
</h1>

<p align="center">
  Sponsor Coinbase Smart Wallet transactions with paymasters on Polygon Proof of Stake chain.
</p>

<div align="center">
  <img src="./public/demo.gif" height="260px" alt="Demo"/>
</div>
<pre align="center">
  Demo of the application
</pre>

## What is EVM Kit?

# Getting Started with Coinbase Smart Wallet

This repository contains a simple Next.js application where users can:

- Connect to the application via Coinbase Smart Wallet.
- Perform transactions from their newly created wallet.
- Pay no gas fees! Thanks to the power of paymasters to cover user's gas fees.

## Live Demo

Try the live demo [here](https://polygon-coinbase-smart-wallet.vercel.app/)

## Setting Up the Project

1. Clone the repository.
2. Install the dependencies using `pnpm install`.
3. Get a thirdweb API key from the [thirdweb dashboard](https://dashboard.thirdweb.com/).
4. Replace the placeholder value in the `src/app/page.tsx` file with your thirdweb client ID.

## Running the Application

Run `pnpm run dev` and visit http://localhost:3000/ in your browser.

## Submitting Transactions from Coinbase Smart Wallet

The application includes a simple smart contract interaction with the connected wallet. It uses a simple Edition Drop smart contract that allows users to mint NFTs for free.

## Sponsoring User Gas Fees with a Paymaster

The application uses paymasters to sponsor the gas fees of user transactions. This is accomplished using the `useSendCalls` hook from the thirdweb SDK.

## Under the Hood of Coinbase Smart Wallet

Coinbase Smart Wallet combines several account abstraction techniques to operate under the hood. It uses ERC-4337 account abstraction, which allows the gas fee of a transaction to be "sponsored" (paid for) by a different wallet than the one submitting the transaction.
