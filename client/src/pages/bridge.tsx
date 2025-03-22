import { useState, useEffect } from "react";
import { useAddress } from "@thirdweb-dev/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Network, Asset, Transaction } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/use-wallet";
import { useBridge } from "@/hooks/use-bridge";
import NetworkSelector from "@/components/bridge/network-selector";
import AssetSelector from "@/components/bridge/asset-selector";
import AmountInput from "@/components/bridge/amount-input";
import TransactionProgress from "@/components/bridge/transaction-progress";
import TransactionHistory from "@/components/transaction/transaction-history";
import { ConnectWallet } from "@thirdweb-dev/react";
import { Loader2 } from "lucide-react";

export default function BridgePage() {
  const address = useAddress();
  const { toast } = useToast();
  const wallet = useWallet();
  const { currentNetwork, switchNetwork, getAssetBalance } = wallet || {};
  const bridge = useBridge();
  const { bridgeAsset, getBridgeFee, isProcessing, currentTransaction } = bridge || {};
  
  // Form state
  const [fromNetwork, setFromNetwork] = useState<Network>("ethereum");
  const [toNetwork, setToNetwork] = useState<Network>("apechain");
  const [asset, setAsset] = useState<Asset>("eth");
  const [amount, setAmount] = useState("");
  
  // Handle network switch for "from" dropdown 
  const handleFromNetworkChange = async (network: Network) => {
    // Don't allow both dropdowns to have the same network
    if (network === toNetwork) {
      setToNetwork(fromNetwork);
    }
    setFromNetwork(network);
    
    // If user changes dropdown, try to switch network in wallet
    if (network !== currentNetwork) {
      const success = await switchNetwork(network);
      if (!success) {
        toast({
          title: "Network Switch Required",
          description: `Please switch your wallet to ${network === 'ethereum' ? 'Ethereum Mainnet' : 'ApeChain (L3)'} to continue.`,
          variant: "destructive"
        });
      }
    }
  };
  
  // Handle network switch for "to" dropdown
  const handleToNetworkChange = (network: Network) => {
    // Don't allow both dropdowns to have the same network
    if (network === fromNetwork) {
      setFromNetwork(toNetwork);
    }
    setToNetwork(network);
  };
  
  // Switch the from/to networks
  const handleSwitchNetworks = () => {
    const temp = fromNetwork;
    setFromNetwork(toNetwork);
    setToNetwork(temp);
  };
  
  // Get the current balance based on the selected asset and network
  const currentBalance = getAssetBalance ? getAssetBalance(asset) : { value: "0", isLoading: false };
  
  // Bridge the asset
  const handleBridge = async () => {
    if (!address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to bridge assets.",
        variant: "destructive"
      });
      return;
    }
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to bridge.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if user has enough balance
    const bal = parseFloat(currentBalance.value);
    const amtToSend = parseFloat(amount);
    
    if (isNaN(bal) || bal < amtToSend) {
      toast({
        title: "Insufficient Balance",
        description: `You don't have enough ${asset.toUpperCase()} to complete this transaction.`,
        variant: "destructive"
      });
      return;
    }
    
    if (bridgeAsset) {
      await bridgeAsset(asset, amount, fromNetwork, toNetwork);
    } else {
      toast({
        title: "Bridge Error",
        description: "The bridge functionality is not available at the moment.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <main className="max-w-2xl mx-auto p-4 md:p-6 mt-8 mb-16">
      {/* Bridge Card */}
      <Card className="bg-white rounded-xl shadow-md mb-8">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-[#1A1A1A] mb-6">Bridge Assets</h2>
          
          {/* Network Selection */}
          <NetworkSelector 
            fromNetwork={fromNetwork}
            toNetwork={toNetwork}
            onFromNetworkChange={handleFromNetworkChange}
            onToNetworkChange={handleToNetworkChange}
            onSwitchNetworks={handleSwitchNetworks}
          />
          
          {/* Asset Selection */}
          <AssetSelector 
            asset={asset}
            onAssetChange={setAsset}
          />
          
          {/* Amount Input */}
          <AmountInput 
            asset={asset}
            amount={amount}
            onAmountChange={setAmount}
            balance={currentBalance.value}
            maxBalance={currentBalance.value}
            fee={getBridgeFee ? getBridgeFee(asset, fromNetwork, toNetwork) : "0"}
          />
          
          {/* Action Button Area */}
          <div id="action-area">
            {!address ? (
              <div id="connect-prompt">
                <ConnectWallet
                  theme="light"
                  btnTitle="Connect Wallet"
                  className="w-full bg-[#0054FA] hover:bg-opacity-90 text-white font-medium py-3 px-4 rounded-lg transition-all"
                />
              </div>
            ) : isProcessing ? (
              <div id="processing-state">
                <Button disabled className="w-full bg-[#0054FA] bg-opacity-70 text-white font-medium py-3 px-4 rounded-lg">
                  <Loader2 className="animate-spin h-5 w-5 mr-3" />
                  Processing...
                </Button>
              </div>
            ) : Number(amount) > Number(currentBalance.value) ? (
              <div id="insufficient-funds">
                <Button disabled className="w-full bg-red-100 text-red-600 font-medium py-3 px-4 rounded-lg">
                  Insufficient funds
                </Button>
              </div>
            ) : (
              <div id="bridge-action">
                <Button 
                  onClick={handleBridge}
                  className="w-full bg-[#0054FA] hover:bg-opacity-90 text-white font-medium py-3 px-4 rounded-lg transition-all"
                >
                  Bridge Assets
                </Button>
              </div>
            )}
          </div>
          
          {/* Transaction Progress */}
          {currentTransaction && (
            <TransactionProgress transaction={currentTransaction as Transaction} />
          )}
        </CardContent>
      </Card>
      
      {/* Transaction History */}
      <TransactionHistory />
    </main>
  );
}
