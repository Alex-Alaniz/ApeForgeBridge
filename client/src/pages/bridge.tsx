import { useState } from "react";
import { ConnectWallet, useAddress } from "@thirdweb-dev/react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Network, Asset, Transaction, TransactionType, InsertTransaction } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import NetworkSelector from "@/components/bridge/network-selector";
import AssetSelector from "@/components/bridge/asset-selector";
import AmountInput from "@/components/bridge/amount-input";
import TransactionProgress from "@/components/bridge/transaction-progress";
import TransactionHistory from "@/components/transaction/transaction-history";
import { Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { NETWORKS, BRIDGE_FEES, EST_TIME_PER_CONFIRMATION, REQUIRED_CONFIRMATIONS } from "@/lib/constants";

export default function BridgePage() {
  // Core state
  const address = useAddress();
  const { toast } = useToast();
  
  // Local state management
  const [fromNetwork, setFromNetwork] = useState<Network>("ethereum");
  const [toNetwork, setToNetwork] = useState<Network>("apechain");
  const [asset, setAsset] = useState<Asset>("eth");
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  
  // Simplified balance handling
  const [balance, setBalance] = useState("1.5");
  
  // Handle network switch for "from" dropdown 
  const handleFromNetworkChange = async (network: Network) => {
    // Don't allow both dropdowns to have the same network
    if (network === toNetwork) {
      setToNetwork(fromNetwork);
    }
    setFromNetwork(network);
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
  
  // Get bridge fee
  const getBridgeFee = (asset: Asset, fromNetwork: Network, toNetwork: Network): string => {
    try {
      const key = `${fromNetwork}_${toNetwork}` as keyof typeof BRIDGE_FEES[typeof asset];
      // Special case: don't allow same network transfers
      if (fromNetwork === toNetwork) return "0";
      return BRIDGE_FEES[asset][key] || "0.001";
    } catch (error) {
      console.error("Error getting bridge fee:", error);
      return "0.001";
    }
  };
  
  // Handle the bridge action
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
    const amtToSend = parseFloat(amount);
    
    if (amtToSend > parseFloat(balance)) {
      toast({
        title: "Insufficient Balance",
        description: `You don't have enough ${asset.toUpperCase()} to complete this transaction.`,
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Create a transaction using the backend API
      const txType: TransactionType = fromNetwork === "ethereum" ? "deposit" : "withdrawal";
      
      const transaction: InsertTransaction = {
        walletAddress: address,
        fromNetwork,
        toNetwork,
        asset,
        amount: amount,
        fee: getBridgeFee(asset, fromNetwork, toNetwork),
        transactionHash: `0x${Math.random().toString(16).substring(2, 16)}${Math.random().toString(16).substring(2, 16)}`,
        status: "pending",
        type: txType,
        confirmations: 0,
        requiredConfirmations: REQUIRED_CONFIRMATIONS
      };
      
      const response = await apiRequest(
        "POST",
        "/api/transactions",
        transaction
      );
      
      // Convert the response to expected format
      const createdTx = await response.json() as Transaction;
      setCurrentTransaction(createdTx);
      
      toast({
        title: "Transaction Initiated",
        description: `Your ${asset.toUpperCase()} is being bridged from ${NETWORKS[fromNetwork].name} to ${NETWORKS[toNetwork].name}.`,
      });
      
      // Simulate confirmations in real application this would be done by backend
      let confirmations = 0;
      const interval = setInterval(async () => {
        confirmations++;
        
        let status = "confirming";
        if (confirmations >= REQUIRED_CONFIRMATIONS) {
          status = "completed";
          clearInterval(interval);
        }
        
        try {
          const updateResponse = await apiRequest(
            "PATCH",
            `/api/transactions/${createdTx.id}/status`,
            { status, confirmations }
          );
          
          const updatedTx = await updateResponse.json() as Transaction;
          setCurrentTransaction(updatedTx);
          
          if (status === "completed") {
            toast({
              title: "Transaction Complete",
              description: `Your ${asset.toUpperCase()} has been successfully bridged!`,
            });
            setIsProcessing(false);
          }
        } catch (error) {
          console.error("Error updating transaction:", error);
        }
      }, 2000); // Update every 2 seconds for demo purposes
      
    } catch (error) {
      console.error("Bridge error:", error);
      toast({
        title: "Bridge Error",
        description: "There was an error processing your transaction.",
        variant: "destructive"
      });
      setIsProcessing(false);
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
            balance={balance}
            maxBalance={balance}
            fee={getBridgeFee(asset, fromNetwork, toNetwork)}
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
            ) : Number(amount) > Number(balance) ? (
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
            <TransactionProgress transaction={currentTransaction} />
          )}
        </CardContent>
      </Card>
      
      {/* Transaction History */}
      <TransactionHistory />
    </main>
  );
}
