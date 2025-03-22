import { useAddress, useSDK, useBalance, useChain, useSwitchChain } from "@thirdweb-dev/react";
import { useEffect, useState } from "react";
import { Network, Asset } from "@shared/schema";

// Map network names to chain IDs
export const NETWORK_CHAIN_IDS: Record<Network, number> = {
  ethereum: 1,        // Ethereum Mainnet
  apechain: 42161     // ApeChain (ARB L3) - we're using Arbitrum's chain ID for demo purposes
};

// Define Chain objects for SDK reference
export const NETWORK_CHAIN_CONFIG = {
  ethereum: {
    chainId: 1, // Ethereum Mainnet
    name: "Ethereum Mainnet",
    shortName: "eth",
    chain: "ETH",
    slug: "ethereum",
    testnet: false,
    rpc: ["https://ethereum.rpc.thirdweb.com"],
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18
    }
  },
  apechain: {
    chainId: 42161, // Using Arbitrum One's chain ID for demo
    name: "ApeChain (L3)",
    shortName: "apechain",
    chain: "APE",
    slug: "apechain",
    testnet: false,
    rpc: ["https://arbitrum-one.public.blastapi.io"], // Default RPC for testing
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18
    }
  }
};

// Map asset names to contract addresses (for tokens like ApeCoin)
export const ASSET_ADDRESSES: Record<Network, Record<Asset, string>> = {
  ethereum: {
    eth: "0x0000000000000000000000000000000000000000", // Native ETH
    ape: "0x4d224452801ACEd8B2F0aebE155379bb5D594381"  // ApeCoin on Ethereum
  },
  apechain: {
    eth: "0x0000000000000000000000000000000000000000", // Native ETH
    ape: "0x74885b4D524d497261259B38900f54e6dbAd2210"  // ApeCoin on ApeChain (example address)
  }
};

export function useWallet() {
  const address = useAddress();
  const sdk = useSDK();
  const currentChain = useChain();
  const switchChain = useSwitchChain();
  
  const [currentNetwork, setCurrentNetwork] = useState<Network>("ethereum");
  
  // Update current network based on connected chain
  useEffect(() => {
    if (currentChain) {
      if (currentChain.chainId === NETWORK_CHAIN_IDS.ethereum) {
        setCurrentNetwork("ethereum");
      } else if (currentChain.chainId === NETWORK_CHAIN_IDS.apechain) {
        setCurrentNetwork("apechain");
      }
    }
  }, [currentChain]);
  
  // ETH balance (passing undefined for native token)
  const { data: ethBalance, isLoading: isEthBalanceLoading } = useBalance();
  
  // ApeCoin balance (passing token address)
  // Only fetch if we have a wallet address
  const { data: apeBalance, isLoading: isApeBalanceLoading } = !address 
    ? { data: undefined, isLoading: false } 
    : useBalance({
        tokenAddress: ASSET_ADDRESSES[currentNetwork].ape
      });

  // Switch to a different network
  const switchNetwork = async (network: Network) => {
    try {
      // Use chain ID from the configuration
      await switchChain(NETWORK_CHAIN_IDS[network]);
      return true;
    } catch (error) {
      console.error("Failed to switch network:", error);
      return false;
    }
  };
  
  // Get balance for a specific asset on the current network
  const getAssetBalance = (asset: Asset) => {
    if (asset === "eth") {
      return {
        value: ethBalance?.displayValue || "0",
        isLoading: isEthBalanceLoading
      };
    } else {
      return {
        value: apeBalance?.displayValue || "0",
        isLoading: isApeBalanceLoading
      };
    }
  };
  
  return {
    address,
    sdk,
    currentNetwork,
    switchNetwork,
    getAssetBalance,
    NETWORK_CHAIN_IDS,
    ASSET_ADDRESSES
  };
}
