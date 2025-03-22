import { Network, Asset } from "@shared/schema";

// Network display info
export const NETWORKS = {
  ethereum: {
    name: "Ethereum Mainnet",
    displayName: "Ethereum",
    icon: "ETH",
    explorerId: "etherscan",
    explorerUrl: "https://etherscan.io",
    chainId: 1,
  },
  apechain: {
    name: "ApeChain (L3)",
    displayName: "ApeChain",
    icon: "APE",
    explorerId: "apechain",
    explorerUrl: "https://explorer.apechain.com",
    chainId: 42161, // We're using Arbitrum's chain ID for demo purposes
  },
};

// Asset display info
export const ASSETS = {
  eth: {
    name: "Ethereum",
    symbol: "ETH",
    displaySymbol: "ETH",
    decimals: 18,
    icon: "ETH"
  },
  ape: {
    name: "ApeCoin",
    symbol: "APE",
    displaySymbol: "APE",
    decimals: 18,
    icon: "APE"
  }
};

// Standard fee for bridging assets
export const BRIDGE_FEES = {
  eth: {
    ethereum_apechain: "0.001",
    apechain_ethereum: "0.002"
  },
  ape: {
    ethereum_apechain: "0.5",
    apechain_ethereum: "1.0"
  }
};

// Mock USD rates for conversion
export const USD_RATES = {
  eth: 2000,
  ape: 3
};

// Required confirmations for bridging to be considered complete
export const REQUIRED_CONFIRMATIONS = 15;

// Estimated time per confirmation in minutes
export const EST_TIME_PER_CONFIRMATION = 1;
