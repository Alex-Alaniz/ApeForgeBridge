import { Asset } from "@shared/schema";
import { Label } from "@/components/ui/label";

interface AssetSelectorProps {
  asset: Asset;
  onAssetChange: (asset: Asset) => void;
}

export default function AssetSelector({ asset, onAssetChange }: AssetSelectorProps) {
  return (
    <div className="mb-6">
      <Label className="block text-sm font-medium text-[#3B3B3B] mb-2">Asset</Label>
      <div className="relative">
        <select 
          id="asset-select" 
          value={asset}
          onChange={(e) => onAssetChange(e.target.value as Asset)}
          className="appearance-none bg-[#FAFAFA] border border-gray-200 rounded-lg py-2.5 px-4 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-[#FF4D4D] focus:border-transparent"
        >
          <option value="eth">Ethereum (ETH)</option>
          <option value="ape">ApeCoin (APE)</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>
    </div>
  );
}
