"use client"; // thirdweb SDK doesn't support server-side rendering yet.

import { createThirdwebClient, getContract } from "thirdweb"; // Create the thirdweb client with your client ID
import {
  ConnectButton, // Connect wallet button and modal
  TransactionButton, // Button to send transactions from the connected wallet
  useActiveAccount, // Hook to grab the connected account
} from "thirdweb/react"; // The component we can prompt the user to connect their wallet with
import { createWallet } from "thirdweb/wallets"; // Function to specify we want to use Coinbase smart wallet
import { claimTo } from "thirdweb/extensions/erc1155"; // Function to claim a
import { useSendCalls } from "thirdweb/wallets/eip5792";

// Import and set the the blockchain you want to use.
// Only certain chains supported: https://www.smartwallet.dev/FAQ#what-networks-are-supported
import { polygon } from "thirdweb/chains";
const chainToUse = polygon;

const thirdwebClient = createThirdwebClient({
  // Grab your thirdweb client id from the thirdweb dashboard
  //Ensure you have a .env.local file with NEXT_PUBLIC_THIRDWEB_CLIENT_ID set to your client ID
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

export default function Home() {
  // Get the account once the user has connected with CB smart wallet
  const account = useActiveAccount();

  // This is so we can use a paymaster service to pay for the transaction gas fees
  const { mutateAsync: sendCalls } = useSendCalls({
    client: thirdwebClient,
    waitForResult: true,
  });

  // Function to send the claim NFT transaction with gas fees covered.
  async function sendSponsoredTransaction() {
    const claimTx = claimTo({
      // Get the contract using a chain + contract address combo
      contract: getContract({
        client: thirdwebClient,
        chain: chainToUse,
        address: "0x04bE3B7a1a034297331A661c5b5E838264Ba0E58", // View contract: https://thirdweb.com/polygon/0x04bE3B7a1a034297331A661c5b5E838264Ba0E58
      }),
      quantity: BigInt(1), // Claim 1 NFT
      to: account?.address!, // To the connected wallet address
      tokenId: BigInt(0), // Of NFT token ID 0
    });

    // Send the transaction with the paymaster service
    return await sendCalls({
      calls: [claimTx], // The claim transaction. We could put multiple transactions here in theory.
      capabilities: {
        paymasterService: {
          // Docs: https://portal.thirdweb.com/connect/account-abstraction/infrastructure
          url: `https://${chainToUse.id}.bundler.thirdweb.com/${thirdwebClient.clientId}`,
        },
      },
    });
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ConnectButton
        client={thirdwebClient}
        // The array of wallets we want to show to users, we just provide 1 - Coinbase Wallet
        wallets={[
          // Use com.coinbase.wallet for Coinbase Wallet
          createWallet("com.coinbase.wallet", {
            walletConfig: {
              // Specify we do not want coinbase wallet browser extension support, just smart wallet
              options: "smartWalletOnly",
            },
            // What chains we want to support in our app
            chains: [chainToUse],
            // This is the metadata that shows up when prompting the user to connect their wallet
            appMetadata: {
              logoUrl: `https://github.com/jarrodwatts/polygon-coinbase-smart-wallet/blob/main/public/wizard-hat.png?raw=true`,
              name: "Polygon 💜🤝 Coinbase Smart Wallet",
              description: "Mint NFTs on Polygon using Coinbase Smart Wallet",
            },
          }),
        ]}
      />
      <TransactionButton
        transaction={() =>
          // @ts-expect-error: Just a type issue, can probably be fixed easily
          sendSponsoredTransaction()
        }
        payModal={false}
      >
        Mint NFT
      </TransactionButton>
    </div>
  );
}
