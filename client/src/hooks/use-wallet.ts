import { useAddress, useSDK, useChain, useSwitchChain } from "@thirdweb-dev/react";
import { useEffect, useState, useMemo } from "react";
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
  // Use ThirdWeb hooks (no try/catch, let errors bubble up properly)
  const address = useAddress();
  const sdk = useSDK();
  const currentChain = useChain();
  const switchChainFn = useSwitchChain();
  
  const [currentNetwork, setCurrentNetwork] = useState<Network>("ethereum");
  
  // Mock balances for development - these would be replaced with actual wallet balances
  const [ethBalance, setEthBalance] = useState("1.5");
  const [apeBalance, setApeBalance] = useState("300");
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  
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
  
  // Simulate loading balances when network changes
  useEffect(() => {
    if (address) {
      setIsBalanceLoading(true);
      
      // Simulate API call to get balances
      setTimeout(() => {
        if (currentNetwork === "ethereum") {
          setEthBalance("1.5");
          setApeBalance("300");
        } else {
          setEthBalance("0.5");
          setApeBalance("100");
        }
        setIsBalanceLoading(false);
      }, 1000);
    }
  }, [currentNetwork, address]);

  // Switch to a different network
  const switchNetwork = async (network: Network) => {
    try {
      if (!switchChainFn) {
        console.error("Chain switching function not available");
        return false;
      }
      
      // Use chain ID from the configuration
      await switchChainFn(NETWORK_CHAIN_IDS[network]);
      return true;
    } catch (error) {
      console.error("Failed to switch network:", error);
      return false;
    }
  };
  
  // Get balance for a specific asset on the current network (with safe fallbacks)
  const getAssetBalance = (asset: Asset) => {
    if (asset === "eth") {
      return {
        value: ethBalance || "0",
        isLoading: isBalanceLoading
      };
    } else {
      return {
        value: apeBalance || "0",
        isLoading: isBalanceLoading
      };
    }
  };
  
  return {
    address: address || undefined,
    sdk,
    currentNetwork,
    switchNetwork,
    getAssetBalance,
    NETWORK_CHAIN_IDS,
    ASSET_ADDRESSES
  };
}
