import { Network } from "@shared/schema";
import { Label } from "@/components/ui/label";
import { RefreshCw } from "lucide-react";

interface NetworkSelectorProps {
  fromNetwork: Network;
  toNetwork: Network;
  onFromNetworkChange: (network: Network) => void;
  onToNetworkChange: (network: Network) => void;
  onSwitchNetworks: () => void;
}

export default function NetworkSelector({
  fromNetwork,
  toNetwork,
  onFromNetworkChange,
  onToNetworkChange,
  onSwitchNetworks
}: NetworkSelectorProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
      {/* From Network */}
      <div className="w-full md:w-5/12">
        <Label className="block text-sm font-medium text-[#3B3B3B] mb-2">From</Label>
        <div className="relative">
          <select 
            id="from-network" 
            value={fromNetwork}
            onChange={(e) => onFromNetworkChange(e.target.value as Network)}
            className="appearance-none bg-[#FAFAFA] border border-gray-200 rounded-lg py-2.5 px-4 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-[#FF4D4D] focus:border-transparent"
          >
            <option value="ethereum">Ethereum Mainnet</option>
            <option value="apechain">ApeChain (L3)</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Switch Networks Button */}
      <button 
        className="bg-[#FAFAFA] hover:bg-gray-200 p-2 rounded-full mx-auto md:mx-0"
        onClick={onSwitchNetworks}
        aria-label="Switch networks"
      >
        <RefreshCw className="w-5 h-5 text-[#3B3B3B]" />
      </button>
      
      {/* To Network */}
      <div className="w-full md:w-5/12">
        <Label className="block text-sm font-medium text-[#3B3B3B] mb-2">To</Label>
        <div className="relative">
          <select 
            id="to-network" 
            value={toNetwork}
            onChange={(e) => onToNetworkChange(e.target.value as Network)}
            className="appearance-none bg-[#FAFAFA] border border-gray-200 rounded-lg py-2.5 px-4 w-full pr-10 focus:outline-none focus:ring-2 focus:ring-[#FF4D4D] focus:border-transparent"
          >
            <option value="apechain">ApeChain (L3)</option>
            <option value="ethereum">Ethereum Mainnet</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
