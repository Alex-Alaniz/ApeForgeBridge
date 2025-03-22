import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Asset } from "@shared/schema";
import { formatUnits } from "ethers/lib/utils";

interface AmountInputProps {
  asset: Asset;
  amount: string;
  onAmountChange: (amount: string) => void;
  balance: string;
  maxBalance: string;
  fee: string;
}

export default function AmountInput({
  asset,
  amount,
  onAmountChange,
  balance,
  maxBalance,
  fee
}: AmountInputProps) {
  const [usdValue, setUsdValue] = useState("0.00");
  
  // Mock USD conversion rates - in a real app, you'd fetch these from an API
  const mockUsdRates = {
    eth: 2000,
    ape: 3
  };
  
  useEffect(() => {
    if (amount && !isNaN(Number(amount))) {
      const assetUsdRate = mockUsdRates[asset] || 0;
      const usdAmount = Number(amount) * assetUsdRate;
      setUsdValue(usdAmount.toFixed(2));
    } else {
      setUsdValue("0.00");
    }
  }, [amount, asset]);

  const handleSetMax = () => {
    onAmountChange(maxBalance);
  };

  const assetSymbol = asset === "eth" ? "ETH" : "APE";
  
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <Label className="block text-sm font-medium text-[#3B3B3B]">Amount</Label>
        <span className="text-xs text-gray-500">Balance: {balance} {assetSymbol}</span>
      </div>
      <div className="relative">
        <input
          type="text"
          id="amount-input"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder="0.0"
          className="font-mono appearance-none bg-[#FAFAFA] border border-gray-200 rounded-lg py-3 px-4 w-full focus:outline-none focus:ring-2 focus:ring-[#FF4D4D] focus:border-transparent text-right pr-16"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
          <button 
            className="text-xs font-medium text-[#FF4D4D] hover:text-opacity-80"
            onClick={handleSetMax}
          >
            MAX
          </button>
        </div>
      </div>
      <div className="flex justify-between items-center mt-2 text-sm">
        <span className="text-gray-500">≈ ${usdValue} USD</span>
        <div className="flex items-center">
          <span className="text-gray-500 mr-1">Fee:</span>
          <span className="font-medium">{fee} {assetSymbol}</span>
        </div>
      </div>
    </div>
  );
}
