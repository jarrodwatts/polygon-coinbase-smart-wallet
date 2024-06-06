// File: /src/app/page.tsx
"use client"; // thirdweb SDK doesn't support server-side rendering yet.

import { createThirdwebClient, getContract } from "thirdweb"; // Create the thirdweb client with your client ID
import {
  ConnectButton,
  TransactionButton,
  useActiveAccount,
} from "thirdweb/react"; // The component we can prompt the user to connect their wallet with
import { createWallet } from "thirdweb/wallets"; // Function to specify we want to use Coinbase smart wallet
import { polygon } from "thirdweb/chains"; // Import the the blockchain you want to use
import { claimTo } from "thirdweb/extensions/erc1155";
import { useSendCalls } from "thirdweb/wallets/eip5792";

const thirdwebClient = createThirdwebClient({
  clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID!,
});

const chainToUse = polygon;

export default function Home() {
  const account = useActiveAccount();

  const { mutateAsync: sendCalls } = useSendCalls({
    client: thirdwebClient,
    waitForResult: true,
  });

  async function sendSponsoredTransaction() {
    const claimTx = claimTo({
      contract: getContract({
        client: thirdwebClient,
        chain: chainToUse,
        address: "0x04bE3B7a1a034297331A661c5b5E838264Ba0E58",
      }),
      quantity: BigInt(1),
      to: account?.address!,
      tokenId: BigInt(0),
    });

    return await sendCalls({
      calls: [claimTx],
      capabilities: {
        paymasterService: {
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
            appMetadata: {
              logoUrl: `https://d391b93f5f62d9c15f67142e43841acc.ipfscdn.io/ipfs/bafybeiepghb2jvinjgmwab3sa3rm2t3zun5jigbhgvdl64mnsjwevupg7q/wizard-hat.png`,
              name: "Coinbase Smart Wallet on Polygon",
              description: "Mint NFTs on Polygon using Coinbase Smart Wallet",
            },
          }),
        ]}
      />
      <TransactionButton
        transaction={() =>
          // @ts-expect-error
          sendSponsoredTransaction()
        }
        payModal={false}
        onTransactionConfirmed={() => alert("Transaction successful")}
        onError={(error) => {
          console.error(error);
          alert("Transaction failed");
        }}
      >
        Mint NFT
      </TransactionButton>
    </div>
  );
}
